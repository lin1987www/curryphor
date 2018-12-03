const MIX = {
    constructors: Symbol('MIX.constructors'),
    fPrototype: Function.prototype,
    fPropertyNames: Object.getOwnPropertyNames(function () {
    }),
    fPrototypePropertyNames: Object.getOwnPropertyNames(function () {
    }.prototype),
    oPrototype: Object.prototype
};

// 之後修改成可以指定 F (constructor 跟 prototype 都是客製化的)  用於之後 curry 後的 Function 結構
const mix = (name, fns, extendsClass) => {
    let constructorArrayArray = fns.reduce((accumulator, currentValue) => {
        function recordAllConstructors(constructorArrayArray, constructor, index) {
            if (constructor != MIX.fPrototype) {
                let constructorArray;
                if (index < constructorArrayArray.length) {
                    constructorArray = constructorArrayArray[index];
                } else {
                    constructorArray = [];
                    constructorArrayArray.push(constructorArray);
                }
                let constructors;
                if (constructor.prototype.hasOwnProperty(MIX.constructors)) {
                    constructors = constructor.prototype[MIX.constructors];
                } else {
                    constructors = [constructor];
                }
                constructors.forEach((constructor) => {
                    if (constructorArray.indexOf(constructor) == -1) {
                        constructorArray.push(constructor);
                    }
                    recordAllConstructors(constructorArrayArray, Object.getPrototypeOf(constructor), index + 1);
                });
            }
        }
        recordAllConstructors(accumulator, currentValue, 0);
        return accumulator;
    }, []);

    // Removing duplicate constructor from constructorArrayArray
    constructorArrayArray = constructorArrayArray.reduce((accumulator, currentValue, index, array) => {
        function findLastIndex(constructor) {
            return array.reduceRight((lastIndex, constructorArray, index) => {
                if (lastIndex == -1 && constructorArray.indexOf(constructor) > -1) {
                    return index;
                }
                return lastIndex;
            }, -1);
        }
        let constructorArray = currentValue.filter(constructor => index == findLastIndex(constructor));
        if (constructorArray.length > 0) {
            accumulator.push(constructorArray);
        }
        return accumulator;
    }, []);

    let F = function () {
        // Pretend to execute new operator with all mixed constructors but with the same THIS.
        let originPrototype = Object.getPrototypeOf(this);
        Object.getPrototypeOf(this)[MIX.constructors].reduce((self, constructor) => {
            Object.setPrototypeOf(this, constructor.prototype);
            constructor.apply(self, []);
            return self;
        }, this);
        Object.setPrototypeOf(this, originPrototype);
    };

    function mergeProperties(target, source, ignorePropertyNames) {
        let objectProperties = source.reduce((accumulator, obj) =>
                Object.assign(accumulator, Object.getOwnPropertyDescriptors(obj)),
            {});
        if (ignorePropertyNames && ignorePropertyNames.length > 0) {
            let deletePropertyNames = Object.getOwnPropertyNames(objectProperties).filter(
                (propertyName) => ignorePropertyNames.indexOf(propertyName) > -1
            );
            deletePropertyNames.forEach((propertyName) => {
                delete objectProperties[propertyName];
            });
        }
        Object.defineProperties(target, objectProperties);
    }

    let lastClass = constructorArrayArray.reduce((newClass, constructorArray, index, array) => {
        //  merging constructorArray to created new class.
        let prototypeArray = constructorArray.map(constructor => constructor.prototype);

        mergeProperties(newClass, constructorArray, MIX.fPropertyNames);
        mergeProperties(newClass.prototype, prototypeArray, MIX.fPrototypePropertyNames);
        newClass.prototype[MIX.constructors] = constructorArray.slice();

        let constructorNames = constructorArray.map(constructor => constructor.name);
        let newClassName = '[' + constructorNames.join(', ') + ']';
        Object.defineProperty(newClass, 'name', {value: newClassName});

        if (index < array.length - 1) {
            let f = function () {
            };
            Object.setPrototypeOf(newClass, f);
            Object.setPrototypeOf(newClass.prototype, f.prototype);
            return f;
        } else {
            return newClass;
        }
    }, F);

    if (extendsClass) {
        Object.setPrototypeOf(lastClass, extendsClass);
        Object.setPrototypeOf(lastClass.prototype, extendsClass.prototype);
    }

    Object.defineProperty(F, 'name', {value: name});

    return F;
};

export {mix, MIX};

