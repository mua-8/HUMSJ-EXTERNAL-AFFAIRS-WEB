import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { addRegistration } from "@/lib/firestore";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export type RegistrationType = "student" | "teacher" | "donor" | "volunteer";

interface RegistrationModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: RegistrationType;
    sector: "qirat" | "charity" | "dawa";
}

const RegistrationModal: React.FC<RegistrationModalProps> = ({ isOpen, onClose, type, sector }) => {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        department: "",
        year: "",
        program: "",
        experience: "",
        interest: "",
        amount: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await addRegistration({
                ...formData,
                type,
                sector,
                status: "pending"
            });

            toast({
                title: "Registration Submitted",
                description: `Your ${type} registration for ${sector} has been received.`,
            });

            onClose();
            setFormData({
                name: "",
                email: "",
                phone: "",
                department: "",
                year: "",
                program: "",
                experience: "",
                interest: "",
                amount: "",
            });
        } catch (error) {
            console.error("Error submitting registration:", error);
            toast({
                title: "Error",
                description: "Failed to submit registration. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderContent = () => {
        switch (type) {
            case "student":
                return (
                    <>
                        <div className="grid gap-2">
                            <Label htmlFor="program">Interested Program</Label>
                            <Select name="program" onValueChange={(val) => handleSelectChange("program", val)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select program" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="nuraniya">Nuraniya (Foundational)</SelectItem>
                                    <SelectItem value="advanced">Advanced Quran Program</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="department">Department</Label>
                            <Input id="department" name="department" value={formData.department} onChange={handleChange} placeholder="e.g. Computer Science" required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="year">Year of Study</Label>
                            <Input id="year" name="year" value={formData.year} onChange={handleChange} placeholder="e.g. 3rd Year" required />
                        </div>
                    </>
                );
            case "teacher":
                return (
                    <>
                        <div className="grid gap-2">
                            <Label htmlFor="experience">Qualifications / Experience</Label>
                            <Textarea id="experience" name="experience" value={formData.experience} onChange={handleChange} placeholder="Briefly describe your Quranic education background..." required />
                        </div>
                    </>
                );
            case "donor":
                return (
                    <>
                        <div className="grid gap-2">
                            <Label htmlFor="type">Donor Type</Label>
                            <Select name="interest" onValueChange={(val) => handleSelectChange("interest", val)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="student">Student</SelectItem>
                                    <SelectItem value="staff">University Staff</SelectItem>
                                    <SelectItem value="alumni">Alumni / Star-Shining</SelectItem>
                                    <SelectItem value="external">Community Member</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="amount">Pledge Amount (Optional)</Label>
                            <Input id="amount" name="amount" value={formData.amount} onChange={handleChange} placeholder="e.g. 500 ETB / Month" />
                        </div>
                    </>
                );
            case "volunteer":
                return (
                    <>
                        <div className="grid gap-2">
                            <Label htmlFor="interest">Area of Interest</Label>
                            <Select name="interest" onValueChange={(val) => handleSelectChange("interest", val)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select area" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="events">Event Organization</SelectItem>
                                    <SelectItem value="mentorship">Youth Mentorship</SelectItem>
                                    <SelectItem value="social_media">Social Media / Design</SelectItem>
                                    <SelectItem value="logistics">Logistics</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="department">Department (if Student)</Label>
                            <Input id="department" name="department" value={formData.department} onChange={handleChange} placeholder="e.g. Medicine" />
                        </div>
                    </>
                );
            default:
                return null;
        }
    };

    const getTitle = () => {
        switch (type) {
            case "student": return "Internal Student Enrollment";
            case "teacher": return "Join as a Teacher";
            case "donor": return "Make a Donation Pledge";
            case "volunteer": return "Volunteer Registration";
            default: return "Registration";
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="font-serif text-2xl text-[#29b6b0]">{getTitle()}</DialogTitle>
                    <DialogDescription>
                        Fill out the form below to {type === "student" ? "enroll" : "register"}. We will contact you shortly.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Your full name" required />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="+251..." required />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email (Optional)</Label>
                        <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="email@example.com" />
                    </div>

                    {renderContent()}

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose} className="border-[#29b6b0] text-[#29b6b0]" disabled={isSubmitting}>
                            Cancel
                        </Button>
                        <Button type="submit" className="bg-[#29b6b0] hover:bg-[#239e99] text-white" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                "Submit Registration"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default RegistrationModal;
