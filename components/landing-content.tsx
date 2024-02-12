"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const testimonials = [
  {
    "name": "Joel",
    "avatar": "J",
    "title": "Aspiring Notary",
    "description": "This notary app was instrumental in helping me pass the notary exam! Its user-friendly interface and comprehensive study materials made studying a breeze."
  },
  {
    "name": "Antonio",
    "avatar": "A",
    "title": "Notary Exam Candidate",
    "description": "I've been using this notary app daily to prepare for the notary exam, and I can honestly say it played a crucial role in my success. The practice quizzes were especially helpful!"
  },
  {
    "name": "Mark",
    "avatar": "M",
    "title": "Newly Certified Notary",
    "description": "This app has changed my approach to studying and ultimately helped me pass the notary exam. I can't imagine having achieved this without it!"
  },
  {
    "name": "Mary",
    "avatar": "M",
    "title": "Professional Notary",
    "description": "The best notary preparation app available, hands down. The premium subscription was definitely worth it for the extra features and content that helped me ace the exam."
  },
];

export const LandingContent = () => {
  return (
    <div className="px-10 pb-20">
      <h2 className="text-center text-4xl text-white font-extrabold mb-10">Testimonials</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {testimonials.map((item) => (
          <Card key={item.description} className="bg-[#192339] border-none text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-x-2">
                <div>
                  <p className="text-lg">{item.name}</p>
                  <p className="text-zinc-400 text-sm">{item.title}</p>
                </div>
              </CardTitle>
              <CardContent className="pt-4 px-0">
                {item.description}
              </CardContent>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  )
}