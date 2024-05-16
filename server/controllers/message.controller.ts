import { Request, Response } from "express";
import MessageUsecase from "../usecases/messageUsecase";
import { HttpStatus } from "../enums/HttpStatus.enum";
import errorHandler from "../middlewares/errorHandler";

class MessageController {
  private _messageUsecase: MessageUsecase;

  constructor(_messageUsecase: MessageUsecase) {
    this._messageUsecase = _messageUsecase;
  }

  async addMessage(req: Request, res: Response): Promise<void> {
    try {
      const messageData = req.body;
      const response = await this._messageUsecase.addMessage(messageData);

      const statusCode = response?.success
        ? HttpStatus.success
        : HttpStatus.NotFound;
      res.status(statusCode).send({
        success: response?.success,
        message: response?.message,
        data: response?.data,
      });
    } catch (error) {
      errorHandler(error, res);
    }
  }

  async getMessagesByConversationId(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const conversationId = req.params.conversationId;
      const response = await this._messageUsecase.getMessagesByConversationId(
        conversationId
      );

      const statusCode = response?.success
        ? HttpStatus.success
        : HttpStatus.NotFound;
      res.status(statusCode).send({
        success: response?.success,
        message: response?.message,
        messages: response?.messages,
      });
    } catch (error) {
      errorHandler(error, res);
    }
  }
}

export default MessageController;
