import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Send, CheckCircle, Users, Star, ArrowLeft } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { addDonation } from "@/lib/donations";

const departments = [
  "Computer Science",
  "Software Engineering",
  "Information Technology",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Medicine",
  "Pharmacy",
  "Nursing",
  "Agriculture",
  "Business Administration",
  "Accounting",
  "Economics",
  "Law",
  "Education",
  "Other",
];

const years = ["1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year", "6th Year"];

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const paymentMethods = [
  { value: "cbe", label: "Commercial Bank of Ethiopia (CBE)" },
  { value: "telebirr", label: "Telebirr" },
  { value: "mpesa", label: "M-Pesa" },
  { value: "awash", label: "Awash Bank" },
  { value: "abyssinia", label: "Bank of Abyssinia" },
  { value: "cash", label: "Cash (In Person)" },
];

const StudentSadaqah = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState("student");
  
  // Student form
  const [studentForm, setStudentForm] = useState({
    fullName: "",
    phone: "",
    idNumber: "",
    department: "",
    year: "",
    amount: "",
    paymentMethod: "",
    startMonth: "",
    idea: "",
  });

  // Star-Shining form
  const [starForm, setStarForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    graduationYear: "",
    currentJob: "",
    location: "",
    amount: "",
    paymentMethod: "",
    idea: "",
  });

  const handleStudentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setStudentForm({ ...studentForm, [e.target.name]: e.target.value });
  };

  const handleStarChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setStarForm({ ...starForm, [e.target.name]: e.target.value });
  };

  const handleStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!studentForm.fullName || !studentForm.phone || !studentForm.idNumber || 
        !studentForm.department || !studentForm.year || !studentForm.amount || 
        !studentForm.paymentMethod || !studentForm.startMonth) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await addDonation({
        fullName: studentForm.fullName,
        phone: studentForm.phone,
        idNumber: studentForm.idNumber,
        department: studentForm.department,
        year: studentForm.year,
        amount: parseFloat(studentForm.amount),
        paymentMethod: studentForm.paymentMethod,
        startMonth: studentForm.startMonth,
        idea: studentForm.idea,
        status: "pending",
        donationType: "student_sadaqah",
      });

      setIsSuccess(true);
      toast({
        title: "Jazakallahu Khairan!",
        description: "Your Sadaqah pledge has been submitted successfully.",
      });
    } catch (error) {
      console.error("Error submitting donation:", error);
      toast({
        title: "Error",
        description: "Failed to submit. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!starForm.fullName || !starForm.phone || !starForm.email || 
        !starForm.graduationYear || !starForm.amount || !starForm.paymentMethod) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await addDonation({
        fullName: starForm.fullName,
        phone: starForm.phone,
        idNumber: starForm.email,
        department: starForm.currentJob,
        year: starForm.graduationYear,
        amount: parseFloat(starForm.amount),
        paymentMethod: starForm.paymentMethod,
        startMonth: new Date().toLocaleString('default', { month: 'long' }),
        idea: starForm.idea,
        status: "pending",
        donationType: "star_shining",
      });

      setIsSuccess(true);
      toast({
        title: "Jazakallahu Khairan!",
        description: "Your donation pledge has been submitted successfully.",
      });
    } catch (error) {
      console.error("Error submitting donation:", error);
      toast({
        title: "Error",
        description: "Failed to submit. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForms = () => {
    setIsSuccess(false);
    setStudentForm({
      fullName: "", phone: "", idNumber: "", department: "", year: "",
      amount: "", paymentMethod: "", startMonth: "", idea: "",
    });
    setStarForm({
      fullName: "", phone: "", email: "", graduationYear: "", currentJob: "",
      location: "", amount: "", paymentMethod: "", idea: "",
    });
  };

  if (isSuccess) {
    return (
      <Layout>
        <section className="py-20 bg-[#f0fafa] min-h-[60vh] flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h1 className="text-3xl font-serif font-bold text-[#1f2937] mb-4">
                Jazakallahu Khairan!
              </h1>
              <p className="text-gray-600 mb-8">
                Your donation pledge has been submitted successfully. May Allah accept your contribution and multiply your rewards.
              </p>
              <Button onClick={resetForms} className="bg-[#29b6b0] hover:bg-[#239e99]">
                Submit Another Pledge
              </Button>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-16 bg-[#f0fafa] overflow-hidden">
        <div className="absolute inset-0 pattern-squares-teal" />
        <div className="container mx-auto px-4 relative z-10">
          <Link
            to="/charity-sector"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-[#29b6b0] transition-colors mb-6"
          >
            <ArrowLeft size={16} />
            Back to Charity Sector
          </Link>
          
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-16 h-16 bg-[#29b6b0]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-8 h-8 text-[#29b6b0]" />
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#1f2937] mb-4">
              Donate to <span className="text-[#29b6b0]">Charity Sector</span>
            </h1>
            <p className="text-lg text-gray-600">
              "The believer's shade on the Day of Resurrection will be their charity." - Prophet Muhammad (ﷺ)
            </p>
          </div>
        </div>
      </section>

      {/* Donation Forms Section */}
      <section className="py-12 bg-[#f8fafc]">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="student" className="flex items-center gap-2">
                  <Users size={18} />
                  Student Sadaqah
                </TabsTrigger>
                <TabsTrigger value="star" className="flex items-center gap-2">
                  <Star size={18} />
                  Star-Shining Association
                </TabsTrigger>
              </TabsList>

              {/* Student Sadaqah Form */}
              <TabsContent value="student">
                <Card className="shadow-lg">
                  <CardHeader className="bg-[#29b6b0] text-white rounded-t-lg">
                    <CardTitle className="text-xl font-serif">Student Monthly Sadaqah</CardTitle>
                    <p className="text-white/80 text-sm">For current Haramaya University students</p>
                  </CardHeader>
                  <CardContent className="p-6">
                    <form onSubmit={handleStudentSubmit} className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="font-semibold text-[#1f2937] border-b pb-2">Personal Information</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                            <Input name="fullName" value={studentForm.fullName} onChange={handleStudentChange} placeholder="Enter your full name" required />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                            <Input name="phone" value={studentForm.phone} onChange={handleStudentChange} placeholder="+251 9XX XXX XXX" required />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Student ID Number *</label>
                            <Input name="idNumber" value={studentForm.idNumber} onChange={handleStudentChange} placeholder="e.g., UGR/12345/14" required />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
                            <Select value={studentForm.department} onValueChange={(value) => setStudentForm({ ...studentForm, department: value })}>
                              <SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger>
                              <SelectContent>
                                {departments.map((dept) => (<SelectItem key={dept} value={dept}>{dept}</SelectItem>))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Year of Study *</label>
                          <Select value={studentForm.year} onValueChange={(value) => setStudentForm({ ...studentForm, year: value })}>
                            <SelectTrigger><SelectValue placeholder="Select year" /></SelectTrigger>
                            <SelectContent>
                              {years.map((year) => (<SelectItem key={year} value={year}>{year}</SelectItem>))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="font-semibold text-[#1f2937] border-b pb-2">Donation Details</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Amount (ETB) *</label>
                            <Input name="amount" type="number" value={studentForm.amount} onChange={handleStudentChange} placeholder="e.g., 50" min="1" required />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Start Month *</label>
                            <Select value={studentForm.startMonth} onValueChange={(value) => setStudentForm({ ...studentForm, startMonth: value })}>
                              <SelectTrigger><SelectValue placeholder="Select month" /></SelectTrigger>
                              <SelectContent>
                                {months.map((month) => (<SelectItem key={month} value={month}>{month}</SelectItem>))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method *</label>
                          <Select value={studentForm.paymentMethod} onValueChange={(value) => setStudentForm({ ...studentForm, paymentMethod: value })}>
                            <SelectTrigger><SelectValue placeholder="Select payment method" /></SelectTrigger>
                            <SelectContent>
                              {paymentMethods.map((method) => (<SelectItem key={method.value} value={method.value}>{method.label}</SelectItem>))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Ideas or Suggestions (Optional)</label>
                          <Textarea name="idea" value={studentForm.idea} onChange={handleStudentChange} placeholder="Share any ideas..." rows={3} />
                        </div>
                      </div>

                      <Button type="submit" disabled={isSubmitting} className="w-full bg-[#29b6b0] hover:bg-[#239e99] text-white py-3">
                        {isSubmitting ? "Submitting..." : <><Send size={18} className="mr-2" />Submit Sadaqah Pledge</>}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Star-Shining Association Form */}
              <TabsContent value="star">
                <Card className="shadow-lg">
                  <CardHeader className="bg-[#29b6b0] text-white rounded-t-lg">
                    <CardTitle className="text-xl font-serif">Star-Shining Association</CardTitle>
                    <p className="text-white/80 text-sm">For Haramaya University Muslim Alumni</p>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="bg-[#e6f7f6] border border-[#29b6b0]/20 rounded-lg p-4 mb-6">
                      <p className="text-sm text-[#1f2937]">
                        <strong>Star-Shining Association</strong> is a network of Muslim graduates from Haramaya University who are now working across Ethiopia. They contribute monthly to support current students and charity programs.
                      </p>
                    </div>
                    
                    <form onSubmit={handleStarSubmit} className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="font-semibold text-[#1f2937] border-b pb-2">Personal Information</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                            <Input name="fullName" value={starForm.fullName} onChange={handleStarChange} placeholder="Enter your full name" required />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                            <Input name="phone" value={starForm.phone} onChange={handleStarChange} placeholder="+251 9XX XXX XXX" required />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                            <Input name="email" type="email" value={starForm.email} onChange={handleStarChange} placeholder="your@email.com" required />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Graduation Year *</label>
                            <Input name="graduationYear" value={starForm.graduationYear} onChange={handleStarChange} placeholder="e.g., 2020" required />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Current Job/Position</label>
                            <Input name="currentJob" value={starForm.currentJob} onChange={handleStarChange} placeholder="e.g., Software Engineer" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                            <Input name="location" value={starForm.location} onChange={handleStarChange} placeholder="e.g., Addis Ababa" />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="font-semibold text-[#1f2937] border-b pb-2">Donation Details</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Pledge Amount (ETB) *</label>
                            <Input name="amount" type="number" value={starForm.amount} onChange={handleStarChange} placeholder="e.g., 500" min="1" required />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method *</label>
                            <Select value={starForm.paymentMethod} onValueChange={(value) => setStarForm({ ...starForm, paymentMethod: value })}>
                              <SelectTrigger><SelectValue placeholder="Select payment method" /></SelectTrigger>
                              <SelectContent>
                                {paymentMethods.map((method) => (<SelectItem key={method.value} value={method.value}>{method.label}</SelectItem>))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Message (Optional)</label>
                          <Textarea name="idea" value={starForm.idea} onChange={handleStarChange} placeholder="Any message for the community..." rows={3} />
                        </div>
                      </div>

                      <Button type="submit" disabled={isSubmitting} className="w-full bg-[#29b6b0] hover:bg-[#239e99] text-white py-3">
                        {isSubmitting ? "Submitting..." : <><Star size={18} className="mr-2" />Join Star-Shining Association</>}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Bank Account Info */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="text-lg">Bank Account Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="font-semibold text-[#29b6b0]">Commercial Bank of Ethiopia (CBE)</p>
                    <p className="text-gray-600">Account: 1000614307599</p>
                    <p className="text-gray-600">Name: HUMSJ Charity</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="font-semibold text-[#29b6b0]">Telebirr</p>
                    <p className="text-gray-600">Number: +251 985 736 451</p>
                    <p className="text-gray-600">Name: HUMSJ Charity</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default StudentSadaqah;
