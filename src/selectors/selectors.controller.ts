// FILE: nexusai-cloud/apps/api/src/selectors/selectors.controller.ts

import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AdminGuard } from 'src/auth/guards/admin.guard'; // <-- Import your AdminGuard

@Controller('selectors')
export class SelectorsController {
    // constructor(private selectorsService: SelectorsService) {} // You will add this later

    // This endpoint is for Admins to write new selectors.
    @Post('upsert')
    @UseGuards(AdminGuard)
    upsertSelector(@Body() dto: any) {
        // Your service logic will go here
        return { message: 'This endpoint is protected for Admins.' };
    }

    // This endpoint is for Agents to download the latest selectors.
    @Get()
    @UseGuards(JwtAuthGuard)
    getAllSelectors() {
        // Your service logic will go here
        return { message: 'This endpoint is protected for any authenticated user.' };
    }
}