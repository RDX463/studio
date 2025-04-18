"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2 } from "lucide-react";
import { suggestDueDate } from "@/ai/flows/suggest-due-date";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

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

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-secondary p-4">
      <Toaster />
      <Card className="w-full max-w-md p-4 rounded-lg shadow-md bg-card">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-foreground">
            TaskMaster
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Link href="/profile" className="text-blue-500 hover:underline">
              Edit Profile
            </Link>
          </div>
          <div className="mb-4">
            <Input
              type="text"
              placeholder="Your Profession"
              value={profession}
              onChange={(e) => setProfession(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <Input
              type="text"
              placeholder="Profession Details"
              value={professionDetails}
              onChange={(e) => setProfessionDetails(e.target.value)}
            />
          </div>
          <div className="flex space-x-2 mb-4">
            <Input
              type="text"
              placeholder="Add a task"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
            />
            <Button onClick={handleAddTask} className="bg-primary text-primary-foreground hover:bg-primary/80">
              Add Task
            </Button>
          </div>
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
                      (Due: {task.dueDate})
                    </span>
                  )}
                </label>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleDeleteTask(task.id)}
                className="hover:bg-red-500 hover:text-red-50"
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
