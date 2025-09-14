import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Link } from "react-router-dom";
import { HelpCircle, FileText, MessageCircle, Phone, Mail } from "lucide-react";

const Help = () => {
  const faqs = [
    {
      question: "How do I submit a report?",
      answer: "Click on 'Report Issue' in the navigation, fill out the form with details about the issue, add photos if possible, and submit. You'll receive a confirmation with a tracking ID."
    },
    {
      question: "How long does it take to resolve issues?",
      answer: "Resolution time varies by issue type and complexity. Emergency issues are prioritized and typically resolved within 24-48 hours. Non-emergency issues usually take 3-10 business days."
    },
    {
      question: "Can I track my report's progress?",
      answer: "Yes! Visit your dashboard to see real-time updates on all your submitted reports. You'll also receive email notifications for major status changes."
    },
    {
      question: "What types of issues can I report?",
      answer: "You can report road maintenance issues, broken street lights, vandalism, trash collection problems, water issues, park maintenance, noise complaints, traffic signal problems, and more."
    },
    {
      question: "Do I need to create an account?",
      answer: "No account is required to submit reports. However, creating an account allows you to track your reports and receive updates more easily."
    },
    {
      question: "What information should I include in my report?",
      answer: "Include a clear title, detailed description, location (address or coordinates), and photos if possible. The more information you provide, the faster we can resolve the issue."
    },
    {
      question: "Can I submit reports anonymously?",
      answer: "Yes, you can submit reports without providing personal information. However, providing contact details helps us communicate updates and ask for clarification if needed."
    },
    {
      question: "What happens after I submit a report?",
      answer: "Your report is reviewed, assigned to the appropriate department, and you'll receive status updates as work progresses. You can track everything in your dashboard."
    }
  ];

  const steps = [
    {
      title: "Submit Report",
      description: "Fill out the issue report form with photos and location details.",
      icon: FileText
    },
    {
      title: "Get Confirmation",
      description: "Receive a unique tracking ID and confirmation email.",
      icon: MessageCircle
    },
    {
      title: "Track Progress",
      description: "Monitor updates in your dashboard as authorities work on the issue.",
      icon: HelpCircle
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4">Help & Support</h1>
          <p className="text-xl text-muted-foreground">
            Find answers to common questions and learn how to use the CivicReport system
          </p>
        </div>

        {/* Getting Started */}
        <Card className="shadow-card mb-8">
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <h3 className="font-semibold mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Ready to Report?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Start by submitting your first civic issue report. It only takes a few minutes.
              </p>
              <Button asChild variant="civic" className="w-full">
                <Link to="/report">Report an Issue</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Track Your Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                View the status of all your submitted reports and receive real-time updates.
              </p>
              <Button asChild variant="success" className="w-full">
                <Link to="/dashboard">View Dashboard</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <Card className="shadow-card mb-8">
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="space-y-2">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-4">
                  <AccordionTrigger className="text-left hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pt-2">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* Contact Support */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Still Need Help?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-civic-blue" />
                    <span className="text-sm">Support: (555) 123-HELP</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-civic-red" />
                    <span className="text-sm">Emergency: (555) 911-CITY</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-civic-blue" />
                    <span className="text-sm">help@civicreport.gov</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-3">Support Hours</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p><strong>Monday - Friday:</strong> 8:00 AM - 5:00 PM</p>
                  <p><strong>Saturday:</strong> 9:00 AM - 1:00 PM</p>
                  <p><strong>Sunday:</strong> Closed</p>
                  <p><strong>Emergency:</strong> 24/7</p>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-civic-amber-light rounded-lg">
              <h4 className="font-medium text-civic-amber mb-2">Emergency Issues</h4>
              <p className="text-sm text-muted-foreground">
                For urgent issues that pose immediate danger to public safety 
                (gas leaks, water main breaks, electrical hazards, etc.), 
                please call our emergency hotline immediately: <strong>(555) 911-CITY</strong>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Help;