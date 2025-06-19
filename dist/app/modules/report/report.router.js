"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportRouter = void 0;
const express_1 = __importDefault(require("express"));
const zodValidationRequest_1 = __importDefault(require("../../../middlewares/zodValidationRequest"));
const report_validation_1 = require("./report.validation");
const report_controller_1 = require("./report.controller");
const router = express_1.default.Router();
router.post("/reportReservation", (0, zodValidationRequest_1.default)(report_validation_1.ReportValidation.reportZodSchema), report_controller_1.ReportController.reportReservation);
router.get("/isAlreadyReported", report_controller_1.ReportController.isAlreadyReported);
exports.ReportRouter = router;
