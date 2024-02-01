import React from 'react'
import { Button } from "@/components/ui/button";

const TimeUp = ({handleState}) => {
    return (
        <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
            <div className="mx-auto px-8 py-16 md:px-12 md:py-20 bg-white shadow-lg rounded-xl border border-gray-200" style={{ borderRadius: '30px' }}>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-6">
                    Time Up!
                </h1>
                <p className="text-center text-md text-gray-700 font-medium mb-5">
                    Your Score is recorded!
                </p>
                <p className="text-center text-md text-gray-700 font-medium mb-4">
                    Click on Check Score to check your final score and submit it!
                </p>
                <Button 
                    className="col-span-12 lg:col-span-2 w-full" 
                    type="submit" 
                    size="icon" 
                    onClick={() => {handleState("done");}}
                >
                    Check Score
                </Button>
            </div>
        </div>
    )
}

export default TimeUp
