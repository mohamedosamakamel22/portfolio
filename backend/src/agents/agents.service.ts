import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Agent, AgentDocument } from '../schemas/agent.schema';
import { CreateAgentDto } from './dto/create-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';

@Injectable()
export class AgentsService {
  constructor(
    @InjectModel(Agent.name) private agentModel: Model<AgentDocument>,
  ) {}

  async create(createAgentDto: CreateAgentDto): Promise<Agent> {
    const dto={
        ...createAgentDto,
        userId:new mongoose.Types.ObjectId("685fe192e9ad4407f2b52ce4")
    }
    const createdAgent = new this.agentModel(dto);
    return createdAgent.save();
  }

  async findAll(limit: number = 10, page: number = 1): Promise<Agent[]> {
    return this.agentModel
      .find({userId: "685fe192e9ad4407f2b52ce4"})
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 })
      .exec();
  }

  async findActive(): Promise<Agent[]> {
    return this.agentModel
      .find({ isActive: true })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string): Promise<Agent> {
    const agent = await this.agentModel.findById(id).exec();
    if (!agent) {
      throw new NotFoundException(`Agent with ID ${id} not found`);
    }
    return agent;
  }

  async update(id: string, updateAgentDto: UpdateAgentDto): Promise<Agent> {
    const updatedAgent = await this.agentModel
      .findByIdAndUpdate(id, updateAgentDto, { new: true })
      .exec();

    if (!updatedAgent) {
      throw new NotFoundException(`Agent with ID ${id} not found`);
    }
    return updatedAgent;
  }

  async remove(id: string): Promise<void> {
    const result = await this.agentModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Agent with ID ${id} not found`);
    }
  }

  async count(): Promise<number> {
    return this.agentModel.countDocuments().exec();
  }

  async countActive(): Promise<number> {
    return this.agentModel.countDocuments({ isActive: true }).exec();
  }
} 