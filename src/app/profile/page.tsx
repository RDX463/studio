"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Textarea } from "@/components/ui/textarea";
import { User, Briefcase, Pencil } from "lucide-react";

interface Profile {
  name: string;
  profession: string;
  details: string;
}

const ProfilePage = () => {
  const [profile, setProfile] = useState<Profile>({
    name: "",
    profession: "",
    details: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    const storedProfile = localStorage.getItem("profile");
    if (storedProfile) {
      setProfile(JSON.parse(storedProfile));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("profile", JSON.stringify(profile));
    toast({
      title: "Profile Saved",
      description: "Your profile has been successfully saved.",
    });
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-background p-4">
      <Toaster />
      <Card className="w-full max-w-md p-4 rounded-lg shadow-md bg-card">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-foreground">
            Your Profile <User className="inline-block h-6 w-6 ml-2" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            <div>
              <Label htmlFor="name" className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>Name</span>
              </Label>
              <Input
                type="text"
                id="name"
                name="name"
                value={profile.name}
                onChange={handleChange}
                placeholder="Your Name"
              />
            </div>
            <div>
              <Label htmlFor="profession" className="flex items-center space-x-2">
                <Briefcase className="h-4 w-4" />
                <span>Profession</span>
              </Label>
              <Input
                type="text"
                id="profession"
                name="profession"
                value={profile.profession}
                onChange={handleChange}
                placeholder="Your Profession"
              />
            </div>
            <div>
              <Label htmlFor="details" className="flex items-center space-x-2">
                <Pencil className="h-4 w-4" />
                <span>Profession Details</span>
              </Label>
              <Textarea
                id="details"
                name="details"
                value={profile.details}
                onChange={handleChange}
                placeholder="Details about your profession (e.g., work hours, typical tasks)"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              />
            </div>
            <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/80">
              Save Profile
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
