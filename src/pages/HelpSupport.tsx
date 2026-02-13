import { useNavigate } from 'react-router-dom';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MessageCircle, Phone, FileText, ChevronRight, Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
    { q: "How to track my order?", a: "You can track your order in real-time from the 'Tracking' page accessible from your active order card." },
    { q: "Can I cancel my order?", a: "Orders can be cancelled within 2 minutes of placement. After that, orders cannot be cancelled as preparation would have already started." },
    { q: "Payment failed but amount deducted?", a: "Don't worry! Failed payments are usually reversed within 3-5 business days. Contact your bank if it takes longer." },
    { q: "How to change delivery address?", a: "Delivery address cannot be changed once an order is placed. Please verify your address before checkout." },
];

export default function HelpSupport() {
    const navigate = useNavigate();

    return (
        <MobileLayout>
            <header className="px-5 pt-6 pb-4 border-b bg-background">
                <div className="flex items-center gap-4 mb-4">
                    <button onClick={() => navigate('/profile')} className="p-2 -ml-2 hover:bg-muted rounded-full transition-colors">
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <h1 className="text-xl font-bold">Help & Support</h1>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="Search issues..." className="pl-10 h-10 rounded-xl" />
                </div>
            </header>

            <div className="p-5 space-y-8">
                <div className="grid grid-cols-2 gap-4">
                    <Card className="p-4 flex flex-col items-center gap-2 hover:bg-muted/50 transition-colors cursor-pointer border-primary/20 bg-primary/5">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                            <MessageCircle className="w-6 h-6 text-primary" />
                        </div>
                        <span className="font-bold text-sm">Chat with us</span>
                    </Card>
                    <Card className="p-4 flex flex-col items-center gap-2 hover:bg-muted/50 transition-colors cursor-pointer">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <Phone className="w-6 h-6 text-green-600" />
                        </div>
                        <span className="font-bold text-sm">Call Support</span>
                    </Card>
                </div>

                <section className="space-y-4">
                    <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Frequently Asked Questions</h2>
                    <Card className="p-2">
                        <Accordion type="single" collapsible className="w-full">
                            {faqs.map((faq, i) => (
                                <AccordionItem key={i} value={`item-${i}`} className="border-none px-2">
                                    <AccordionTrigger className="text-sm font-medium hover:no-underline py-4 text-left leading-snug">
                                        {faq.q}
                                    </AccordionTrigger>
                                    <AccordionContent className="text-muted-foreground text-xs leading-relaxed">
                                        {faq.a}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </Card>
                </section>

                <section className="space-y-4">
                    <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Other Options</h2>
                    <Card className="divide-y">
                        <button className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                            <div className="flex items-center gap-4">
                                <FileText className="w-5 h-5 text-muted-foreground" />
                                <span className="font-medium text-sm">Raise a Ticket</span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        </button>
                        <button className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors" onClick={() => navigate('/orders')}>
                            <div className="flex items-center gap-4">
                                <FileText className="w-5 h-5 text-muted-foreground" />
                                <span className="font-medium text-sm">Previous Orders Support</span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        </button>
                    </Card>
                </section>
            </div>

            <div className="p-5 pt-0">
                <p className="text-[10px] text-center text-muted-foreground italic">
                    v2.4.12 • Daily Plate Care
                </p>
            </div>
        </MobileLayout>
    );
}
