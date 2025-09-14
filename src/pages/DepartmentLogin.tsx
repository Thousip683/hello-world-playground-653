import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Building2, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const DepartmentLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        setError(error.message);
        return;
      }

      toast({
        title: "Welcome to Department Portal",
        description: "Successfully logged in to manage your assigned reports.",
      });
      
      navigate("/department/dashboard");
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center">
              <Building2 className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-foreground">Department Portal</h1>
          <p className="text-muted-foreground">
            Access your assigned civic reports and manage departmental tasks
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Department Staff Login</CardTitle>
            <CardDescription>
              Sign in with your department credentials to access assigned reports
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Department Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="fire@city.gov"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  "Sign In to Department Portal"
                )}
              </Button>
            </form>
            
            <div className="mt-6 pt-6 border-t text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Need help accessing your account?
              </p>
              <div className="flex flex-col gap-2">
                <Link 
                  to="/admin/login" 
                  className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Admin Portal →
                </Link>
                <Link 
                  to="/auth" 
                  className="text-sm text-green-600 hover:text-green-700 transition-colors"
                >
                  Citizen Portal →
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            © 2024 CivicReport Department Portal. Secure access for municipal staff.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DepartmentLogin;