import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";

// def a function to do some validation logic for the user request
const handleValidationErrors = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // check if there are validation errors
    const errors = validationResult(req);

    // if there are validation errors, return a 400 response with the error messages
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array() });
    }

    // call the next middleware
    next();
};

export const validateBusinessUpdateRequest = [
    // define the validation rules for request
    body("name")
        .isString()
        .isLength({ min: 2 })
        .notEmpty()
        .withMessage("name is required and must be at least 2 characters long"),
    body("addressLine1")
        .isString()
        .isLength({ min: 2 })
        .notEmpty()
        .withMessage(
            "address is required and must be at least 2 characters long"
        ),
    body("addressLine2")
        .optional()
        .isString()
        .withMessage("address must be a string"),
    body("city").optional().isString().withMessage("City must be a string"),
    body("state").optional().isString().withMessage("State must be a string"),
    body("zip")
        .optional()
        .isString()
        .withMessage("zip is important for delivery"),
    body("country")
        .optional()
        .isString()
        .withMessage("country must be a string"),
    body("phoneNumber")
        .isString()
        .withMessage("phone number is required and must be a string"),
    body("email")
        .isEmail()
        .withMessage("email is required and must be a valid email"),
    body("logoURL")
        .optional()
        .isURL()
        .withMessage("logo URL must be a valid URL"),
    body("description")
        .optional()
        .isString()
        .withMessage("description must be a string"),
    body("managerName")
        .isString()
        .withMessage("manager name is required and must be a string"),

    // apply the validation rules to the request body by calling the handleValidationErrors function
    handleValidationErrors,
];

export const validateBusinessStaffUpdateRequest = [
    // define the validation rules for request
    body("name")
        .isString()
        .isLength({ min: 2 })
        .notEmpty()
        .withMessage("name is required and must be at least 2 characters long"),
    body("addressLine1")
        .optional()
        .isString()
        .withMessage(
            "address is required and must be at least 2 characters long"
        ),
    body("addressLine2")
        .optional()
        .isString()
        .withMessage("address must be a string"),
    body("city").optional().isString().withMessage("City must be a string"),
    body("state").optional().isString().withMessage("State must be a string"),
    body("zip")
        .optional()
        .isString()
        .withMessage("zip is important for delivery"),
    body("country")
        .optional()
        .isString()
        .withMessage("country must be a string"),
    body("phoneNumber")
        .isString()
        .withMessage("phone number is required and must be a string"),
    body("photoURL")
        .optional()
        .isURL()
        .withMessage("photo URL must be a valid URL"),
    body("role").notEmpty().isString().withMessage("role must be a string"),

    // apply the validation rules to the request body by calling the handleValidationErrors function
    handleValidationErrors,
];
