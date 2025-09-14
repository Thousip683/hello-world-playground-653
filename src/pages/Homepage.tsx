import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { FileText, MapPin, Bell, BarChart3, Users, Shield, Zap, CheckCircle, Clock, TrendingUp } from "lucide-react";
import { Layout } from "@/components/Layout";
import { IssueStatsChart } from "@/components/charts/IssueStatsChart";
import { useAuth } from "@/hooks/useAuth";


const steps = [
  {
    icon: FileText,
    title: "1. Submit a Report",
    description: "Quickly fill out a form with photos and location. Takes just 2 minutes.",
    button: "Start Reporting",
    link: (user: any) => user ? "/report" : "/auth",
    variant: "civic" as const,
    delay: 0.2
  },
  {
    icon: BarChart3,
    title: "2. Track Progress",
    description: "Monitor real-time updates in your dashboard as authorities work on your issue.",
    button: "View Dashboard",
    link: (user: any) => user ? "/dashboard" : "/auth",
    variant: "civic" as const,
    delay: 0.4
  },
  {
    icon: Bell,
    title: "3. Get Resolution",
    description: "Receive notifications when your issue is resolved and see the results.",
    button: "Learn More",
    link: () => "/help",
    variant: "success" as const,
    delay: 0.6
  }
];

const stats = [
  { icon: FileText, value: "2,847", label: "Issues Reported", color: "text-civic-blue" },
  { icon: CheckCircle, value: "2,156", label: "Issues Resolved", color: "text-civic-green" },
  { icon: Clock, value: "3.2", label: "Avg Days to Resolve", color: "text-civic-amber" },
  { icon: TrendingUp, value: "96%", label: "Satisfaction Rate", color: "text-civic-blue" }
];

const Homepage = () => {
  const { user } = useAuth();

  return (
    <Layout>
      <div className="space-y-20">
        {/* Hero Section */}
{/* Hero Section */}
<motion.section
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  style={{ backgroundImage: "url('/assets/background.webp')" }}
  className="relative bg-cover bg-center bg-no-repeat overflow-hidden min-h-[80vh] flex items-center justify-center"
>
  {/* Optional dark overlay for readability */}
  <div className="absolute inset-0 bg-black/50" />

  <motion.div
    initial={{ y: 50, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ delay: 0.2 }}
    className="relative z-10 container mx-auto px-4 py-24 flex flex-col items-center 
               bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent"
  >
    <motion.h1
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-center"
    >
      Empower Your Community,
      <br />
      Report. Track. Resolve.
    </motion.h1>

    <motion.p
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.6 }}
      className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto text-center"
    >
      Seamlessly connect with local authorities and track the progress of community improvements.
    </motion.p>

    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.8 }}
      className="flex flex-col sm:flex-row gap-4 justify-center"
    >
      <Button
        asChild
        size="lg"
        variant="secondary"
        className="text-lg px-8 py-6 hover:scale-105 transition-transform 
                   bg-gradient-to-r from-civic-green to-civic-blue bg-clip-text text-transparent"
      >
        <Link to={user ? "/report" : "/auth"}>
          {user ? "Report an Issue" : "Get Started"}
        </Link>
      </Button>

      <Button
        asChild
        size="lg"
        variant="outline"
        className="text-lg px-8 py-6 border-white/20 hover:bg-white/10 hover:scale-105 transition-transform 
                   bg-gradient-to-r from-civic-green to-civic-blue bg-clip-text text-transparent"
      >
        <Link to={user ? "/dashboard" : "/auth"}>
          {user ? "Track My Reports" : "Sign In"}
        </Link>
      </Button>
    </motion.div>

    <div className="mt-16 flex justify-center">
      <span className="animate-bounce text-3xl opacity-80">
        &#8595;
      </span>
    </div>
  </motion.div>

  {/* Floating Elements */}
  <motion.div
    animate={{ y: [0, -10, 0] }}
    transition={{ duration: 3, repeat: Infinity }}
    className="absolute top-20 left-10 p-4 bg-background/10 backdrop-blur-sm rounded-full"
  >
    <Zap className="w-6 h-6 text-white" />
  </motion.div>

  <motion.div
    animate={{ y: [0, 10, 0] }}
    transition={{ duration: 4, repeat: Infinity, delay: 1 }}
    className="absolute top-32 right-16 p-4 bg-background/10 backdrop-blur-sm rounded-full"
  >
    <CheckCircle className="w-6 h-6 text-white" />
  </motion.div>
</motion.section>



        {/* How It Works - Stepper Style */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="container mx-auto px-4"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Just three steps to make your city better
            </p>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 max-w-5xl mx-auto">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: step.delay }}
                whileHover={{ scale: 1.04 }}
                className="relative flex flex-col items-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-civic-blue to-civic-green rounded-full flex items-center justify-center mb-4 shadow-lg">
                  <step.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-center mb-4">{step.description}</p>
                <Button asChild variant={step.variant} size="sm" className="hover:scale-105 transition-transform">
                  <Link to={step.link(user)}>{step.button}</Link>
                </Button>
                {index < 2 && (
                  <div className="hidden md:block absolute right-[-40px] top-8 w-20 h-1 bg-gradient-to-r from-civic-blue/30 to-civic-green/30 rounded-full"></div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Quick Links */}
        <section className="bg-muted/30">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">Quick Access</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="p-8 bg-gradient-to-br from-civic-blue/10 to-civic-green/10 shadow-card hover:shadow-elevated hover:scale-[1.02] transition-all duration-300">
                  <CardContent className="pt-0">
                    <div className="flex items-center mb-4">
                      <BarChart3 className="w-8 h-8 text-civic-blue mr-3" />
                      <h3 className="text-xl font-semibold">Track My Reports</h3>
                    </div>
                    <p className="text-muted-foreground mb-6">
                      View the status of all your submitted reports in one place. Get real-time updates and communicate with authorities.
                    </p>
                    <Button asChild variant="civic" className="w-full">
                      <Link to="/dashboard">Go to Dashboard</Link>
                    </Button>
                  </CardContent>
                </Card>
                <Card className="p-8 bg-gradient-to-br from-civic-green/10 to-civic-blue/10 shadow-card hover:shadow-elevated hover:scale-[1.02] transition-all duration-300">
                  <CardContent className="pt-0">
                    <div className="flex items-center mb-4">
                      <Users className="w-8 h-8 text-civic-green mr-3" />
                      <h3 className="text-xl font-semibold">Need Help?</h3>
                    </div>
                    <p className="text-muted-foreground mb-6">
                      Find answers to common questions, learn how to use the system, or contact our support team for assistance.
                    </p>
                    <Button asChild variant="success" className="w-full">
                      <Link to="/help">View FAQs</Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Analytics Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="container mx-auto px-4"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Live Community Analytics</h2>
            <p className="text-xl text-muted-foreground">
              Real-time insights into our civic engagement platform
            </p>
          </div>
          <IssueStatsChart />
        </motion.section>

        {/* Statistics */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="container mx-auto px-4"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Making a Difference</h2>
            <p className="text-xl text-muted-foreground">
              See how our community works together to improve our city
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="text-center"
              >
                <Card className="p-6 shadow-card border-border/50 bg-background/95 backdrop-blur-sm">
                  <CardContent className="pt-0">
                   
                    {stat.icon && <stat.icon className={`w-8 h-8 mx-auto mb-3 ${stat.color}`} />}
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className={`text-4xl font-bold mb-2 ${stat.color}`}
                    >
                      {stat.value}
                    </motion.div>
                    <p className="text-muted-foreground">{stat.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </Layout>
  );
};

export default Homepage;