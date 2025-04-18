"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Trash2,
  CheckCircle,
  PlusCircle,
  Calendar,
  Edit,
  Brain,
} from "lucide-react";
import { suggestDueDate } from "@/ai/flows/suggest-due-date";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { suggestHealthcareTasks } from "@/ai/flows/suggest-healthcare-tasks";

interface Task {
  id: string;
  text: string;
  completed: boolean;
  dueDate?: string;
}

export default function Home() {
  const [newTask, setNewTask] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const { toast } = useToast();
  const [profession, setProfession] = useState("");
  const [professionDetails, setProfessionDetails] = useState("");
  const [suggestedTasks, setSuggestedTasks] = useState<string[]>([]);
  const [profileLoaded, setProfileLoaded] = useState(false);

  useEffect(() => {
    const storedProfile = localStorage.getItem("profile");
    if (storedProfile) {
      const profile = JSON.parse(storedProfile);
      setProfession(profile.profession);
      setProfessionDetails(profile.details);
      setProfileLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (profileLoaded) {
      getSuggestedTasks();
    }
  }, [profileLoaded, profession, professionDetails]);

  const getSuggestedTasks = async () => {
    if (profession && professionDetails) {
      try {
        const suggestedTasksResult = await suggestHealthcareTasks({
          profession: profession,
          professionDetails: professionDetails,
        });
        setSuggestedTasks(suggestedTasksResult.tasks);
      } catch (error: any) {
        toast({
          title: "Error suggesting healthcare tasks.",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  };

  const handleAddTask = async () => {
    if (newTask.trim() === "") return;

    try {
      const suggestedDate = await suggestDueDate({
        task: newTask,
        profession: profession,
        professionDetails: professionDetails,
      });

      setTasks([
        ...tasks,
        {
          id: crypto.randomUUID(),
          text: newTask,
          completed: false,
          dueDate: suggestedDate.dueDate,
        },
      ]);
      setNewTask("");
    } catch (error: any) {
      toast({
        title: "Error suggesting due date.",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleCompleteTask = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const handleAddSuggestedTask = (task: string) => {
    setNewTask(task);
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-background p-6">
      <Toaster />
      <Card className="w-full max-w-md rounded-lg shadow-md bg-card">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-2xl font-semibold text-foreground">
            TaskMaster 🚀
          </CardTitle>
        </CardHeader>
        <CardContent className="pl-2 pr-2">
          <div className="mb-4 flex justify-between items-center">
            <Link
              href="/profile"
              className="text-primary hover:underline flex items-center space-x-2"
            >
              <Edit className="h-4 w-4" />
              <span>Edit Profile</span>
            </Link>
          </div>
          <div className="flex space-x-2 mb-4">
            <Input
              type="text"
              placeholder="Add a task"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              className="rounded-md shadow-sm"
            />
            <Button
              onClick={handleAddTask}
              className="bg-primary text-primary-foreground hover:bg-primary/80 rounded-md"
            >
              Add Task <PlusCircle className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {suggestedTasks.length > 0 && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center">
                <Brain className="mr-2 h-5 w-5" /> Suggested Tasks:
              </h3>
              <ul className="space-y-2">
                {suggestedTasks.map((task, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between py-2 rounded-md bg-secondary"
                  >
                    <span className="text-sm text-muted-foreground ml-2">{task}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddSuggestedTask(task)}
                      className="mr-2"
                    >
                      Add <PlusCircle className="ml-2 h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between py-2 border-b border-border last:border-none"
            >
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={task.id}
                  checked={task.completed}
                  onCheckedChange={() => handleCompleteTask(task.id)}
                />
                <label
                  htmlFor={task.id}
                  className={`text-sm text-foreground ${
                    task.completed ? "line-through opacity-50" : ""
                  }`}
                >
                  {task.text}
                  {task.dueDate && (
                    <span className="text-xs text-muted-foreground">
                      {" "}
                      <Calendar className="inline-block h-3 w-3 mr-1" />
                      (Due: {task.dueDate})
                    </span>
                  )}
                </label>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleDeleteTask(task.id)}
                className="hover:bg-red-500 hover:text-red-50 rounded-md"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
