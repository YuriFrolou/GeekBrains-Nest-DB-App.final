import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Logger, UseGuards } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { WsJwtGuard } from '../../auth/ws-jwt.guard';
import { CommentsService } from './comments.service';
import { OnEvent } from '@nestjs/event-emitter';
import { Roles } from '../../auth/role/roles.decorator';
import { Role } from '../../auth/role/role.enum';
import { UpdateCommentDto } from '../../dto/update-comment.dto';


export type Comment = { message: string; idNews: number };
export type DeletedComment = {idNews: number; idComment: number };
export type UpdatedComment = {newsId: number; id: number; message: string};

@WebSocketGateway()
export class SocketCommentsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly commentsService: CommentsService) {}
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('AppGateway');

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('addComment')
  async handleMessage(client: Socket, comment: Comment):Promise<void> {
    const { idNews, message } = comment;
     const userId: number = client.data.user.sub;
     const _comment = await this.commentsService.create(idNews, message, userId);
     this.server.to(idNews.toString()).emit('newComment', _comment);
  }

  @UseGuards(WsJwtGuard)
  @Roles(Role.Admin,Role.User)
  @SubscribeMessage('deleteComment')
  async deleteMessage(client: Socket, comment: DeletedComment):Promise<void> {
    const { idNews, idComment } = comment;
    const userId: number = client.data.user.sub;
    const _comment = await this.commentsService.findOne(+idComment);
    if(_comment&&_comment.user.id===userId||_comment.user.roles==='admin'){
      await this.commentsService.remove(+idComment,+userId);
      this.server.to(idNews.toString()).emit('removeComment', { id: idComment });
    }
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('updateComment')
  async updateMessage(client: Socket, comment: UpdatedComment):Promise<void> {
    const { newsId, id, message } = comment;
    const userId: number = client.data.user.sub;
    let _comment = await this.commentsService.findOne(id);
     if(_comment&&_comment.user.id==userId){
      _comment = await this.commentsService.update(id,message);
      this.server.to(newsId.toString()).emit('updatedComment', {id,comment:_comment });
     }
  }

  @OnEvent('comment.remove')
  handleRemoveCommentEvent(payload) {
    const { commentId, newsId } = payload;
    this.server.to(newsId.toString()).emit('removeComment', { id: commentId });
  }

  @OnEvent('comment.update')
  handleUpdateCommentEvent(payload) {
    const { newsId,commentId,comment } = payload;
    this.server.to(newsId.toString()).emit('updatedComment', {id:commentId,comment});
  }

  afterInit(server: Server):void {
    this.logger.log('Init');
  }

  handleDisconnect(client: Socket):void {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  async handleConnection(client: Socket, ...args: any[]):Promise<void> {
    const { newsId } =
    client.handshake.query;
    client.join(newsId);
    this.logger.log(`Client connected: ${client.id}`);
  }
}
