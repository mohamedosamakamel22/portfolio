import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IpAddress, IpAddressDocument } from '../schemas/ip-address.schema';
import { RecordVisitDto } from './dto/record-visit.dto';

@Injectable()
export class IpAddressService {
    constructor(
        @InjectModel(IpAddress.name) private ipAddressModel: Model<IpAddressDocument>,
    ) {}

    async recordVisit(recordVisitDto: RecordVisitDto): Promise<{ 
        message: string; 
        isNewVisitor: boolean; 
        visitCount: number; 
        ip: string 
    }> {
        const { ip } = recordVisitDto;

        // Check if IP already exists
        const existingIp = await this.ipAddressModel.findOne({ ip });

        if (existingIp) {
            // IP exists, increment visit count and update last visit
            existingIp.visitCount += 1;
            existingIp.lastVisit = new Date();
            await existingIp.save();

            return {
                message: 'Visit recorded - returning visitor',
                isNewVisitor: false,
                visitCount: existingIp.visitCount,
                ip: existingIp.ip
            };
        } else {
            // New IP, create new record
            const newIpRecord = new this.ipAddressModel({
                ip,
                visitCount: 1,
                firstVisit: new Date(),
                lastVisit: new Date()
            });

            await newIpRecord.save();

            return {
                message: 'Visit recorded - new visitor',
                isNewVisitor: true,
                visitCount: 1,
                ip: newIpRecord.ip
            };
        }
    }

    async getVisitorStats(): Promise<{
        totalVisits: number;
        uniqueIPs: number;
    }> {
        const uniqueIPs = await this.ipAddressModel.countDocuments();
        const visitStats = await this.ipAddressModel.aggregate([
            {
                $group: {
                    _id: null,
                    totalVisits: { $sum: '$visitCount' }
                }
            }
        ]);

        const stats = visitStats[0] || { totalVisits: 0 };

        return {
            totalVisits: stats.totalVisits,
            uniqueIPs
        };
    }


} 