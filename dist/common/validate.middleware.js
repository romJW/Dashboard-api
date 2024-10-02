"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateMiddleWare = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class ValidateMiddleWare {
    constructor(classToValidate) {
        this.classToValidate = classToValidate;
        console.log('classToValidate:', this.classToValidate);
    }
    execute({ body }, res, next) {
        const instance = (0, class_transformer_1.plainToClass)(this.classToValidate, body);
        (0, class_validator_1.validate)(instance).then((errors) => {
            if (errors.length > 0) {
                res.status(422).send(errors);
            }
            else {
                next();
            }
        });
    }
}
exports.ValidateMiddleWare = ValidateMiddleWare;
//# sourceMappingURL=validate.middleware.js.map