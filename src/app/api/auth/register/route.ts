import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request:NextRequest) => {

    try {
        
        const {email, password} = await request.json()

        if(!email || !password){
            return NextResponse.json(
                {
                    error: 'Email and Password are required',
                },
                { status: 400}
            )
        }

        await connectToDatabase()

        const existingUser  = await User.findOne({email})

        if(existingUser){
            return NextResponse.json(
                {
                    error: 'Email is already registered',
                },
                { status: 400}
            )
        }

        await User.create({email, password})
        return NextResponse.json(
            {
                message: 'User registered Successfully',
            },
            { status: 201}
        )

    } catch (error) {
        console.log('error', error)
        return NextResponse.json(
            {
                error: 'Failed to register User!',
            },
            { status: 500}
        )
    }
}

