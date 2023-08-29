"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.routerTicket = void 0;
const express_1 = __importDefault(require("express"));
const TicketController_1 = require("../controllers/TicketController");
const Validate_1 = __importDefault(require("../middleware/Validate"));
const TicketSchema_1 = require("../ZodSchema/TicketSchema");
const upload_1 = require("../middleware/upload");
const Protected_1 = require("../middleware/Protected");
const routerTicket = express_1.default.Router();
exports.routerTicket = routerTicket;
routerTicket.post("/", Protected_1.protect, upload_1.upload.single("image"), (0, Validate_1.default)(TicketSchema_1.postTicketZodSchema), TicketController_1.postTicket);
routerTicket.get("/allticket/:event_id", TicketController_1.getTicket);
routerTicket.get("/:event_id", Protected_1.protect, TicketController_1.getTicketUserId);
routerTicket.get("/ticketinfo/:_id", Protected_1.protect, TicketController_1.infoTicket);
routerTicket.get("/user/:user_id", Protected_1.protect, TicketController_1.getTicketByIdUser);
routerTicket.put("/purchase/:_id", TicketController_1.purchaseTicket);
routerTicket.delete("/delete/:_id", Protected_1.protect, TicketController_1.deleteTicketByUser);
//for Admin
routerTicket.get("/all/admin", Protected_1.protectAdmin, TicketController_1.getAllTicketAdmin);
routerTicket.put("/ismatched/admin/:_id", TicketController_1.ticketIsMatched);
