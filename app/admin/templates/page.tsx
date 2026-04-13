"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Trash2, Plus, Edit2 } from "lucide-react";

interface Template {
  id: string;
  name: string;
  description: string;
  thumbnail_url: string;
  html_template: string;
  react_component: string;
  metadata: any;
  is_active: boolean;
  created_at: string;
}

export default function AdminTemplates() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    thumbnail_url: "",
    html_template: "",
    react_component: "",
    metadata: "{}",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Check if user is admin
  useEffect(() => {
    const checkAdmin = async () => {
      if (status === "authenticated" && session?.user?.email) {
        try {
          const res = await fetch("/api/admin/check-role");
          const data = await res.json();
          
          console.log("Admin check response:", data);
          
          if (data.isAdmin) {
            setIsAdmin(true);
            fetchTemplates();
          } else {
            console.log("User is not admin, redirecting");
            router.push("/dashboard");
          }
        } catch (error) {
          console.error("Failed to check admin status:", error);
          router.push("/dashboard");
        } finally {
          setIsLoading(false);
        }
      }
    };

    checkAdmin();
  }, [status, session, router]);

  const fetchTemplates = async () => {
    try {
      const res = await fetch("/api/templates");
      const data = await res.json();
      setTemplates(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to fetch templates:", error);
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      alert("Template name is required");
      return;
    }

    if (!formData.html_template.trim() && !formData.react_component.trim()) {
      alert("Please provide at least one template (HTML or React)");
      return;
    }

    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `/api/templates/${editingId}` : "/api/templates";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          metadata: JSON.parse(formData.metadata),
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        alert(error.error || "Failed to save template");
        return;
      }

      setShowDialog(false);
      setFormData({
        name: "",
        description: "",
        thumbnail_url: "",
        html_template: "",
        react_component: "",
        metadata: "{}",
      });
      setEditingId(null);
      fetchTemplates();
    } catch (error) {
      console.error("Error saving template:", error);
      alert("Failed to save template");
    }
  };

  const handleEdit = (template: Template) => {
    setFormData({
      name: template.name,
      description: template.description || "",
      thumbnail_url: template.thumbnail_url || "",
      html_template: template.html_template || "",
      react_component: template.react_component || "",
      metadata: JSON.stringify(template.metadata || {}),
    });
    setEditingId(template.id);
    setShowDialog(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this template?")) return;

    try {
      const res = await fetch(`/api/templates/${id}`, { method: "DELETE" });
      if (!res.ok) {
        alert("Failed to delete template");
        return;
      }
      fetchTemplates();
    } catch (error) {
      console.error("Error deleting template:", error);
      alert("Failed to delete template");
    }
  };

  if (status === "loading" || isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-screen flex-col gap-4">
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p className="text-muted-foreground">You need admin privileges to access this page</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Templates Manager</h1>
            <p className="text-muted-foreground mt-2">Create and manage OG image templates</p>
          </div>
          <Button
            variant="hero"
            onClick={() => {
              setEditingId(null);
              setFormData({
                name: "",
                description: "",
                thumbnail_url: "",
                html_template: "",
                react_component: "",
                metadata: "{}",
              });
              setShowDialog(true);
            }}
          >
            <Plus className="h-4 w-4 mr-2" /> New Template
          </Button>
        </div>

        {/* Templates Grid */}
        {templates.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No templates yet. Create one to get started!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template) => (
              <div
                key={template.id}
                className="border border-border rounded-lg p-4 hover:border-primary transition-colors"
              >
                {template.thumbnail_url && (
                  <img
                    src={template.thumbnail_url}
                    alt={template.name}
                    className="w-full h-40 object-cover rounded mb-4"
                  />
                )}
                <h3 className="text-lg font-semibold text-foreground">{template.name}</h3>
                {template.description && (
                  <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
                )}
                <div className="mt-4 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(template)}
                    className="flex-1"
                  >
                    <Edit2 className="h-3 w-3 mr-1" /> Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(template.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Template Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Template" : "Create New Template"}</DialogTitle>
            <DialogDescription>
              Define your template by providing HTML and/or React component code
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Template Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Modern Blue"
              />
            </div>

            <div>
              <Label>Description</Label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe this template"
              />
            </div>

            <div>
              <Label>Thumbnail URL</Label>
              <Input
                value={formData.thumbnail_url}
                onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                placeholder="https://example.com/thumbnail.png"
              />
            </div>

            <div>
              <Label>HTML Template (CSS & Markup)</Label>
              <Textarea
                value={formData.html_template}
                onChange={(e) => setFormData({ ...formData, html_template: e.target.value })}
                placeholder='<div style="...">Your HTML template</div>'
                className="font-mono h-40"
              />
            </div>

            <div>
              <Label>React Component (Optional)</Label>
              <Textarea
                value={formData.react_component}
                onChange={(e) => setFormData({ ...formData, react_component: e.target.value })}
                placeholder="export default function Template() { return (...) }"
                className="font-mono h-40"
              />
            </div>

            <div>
              <Label>Metadata (JSON)</Label>
              <Textarea
                value={formData.metadata}
                onChange={(e) => setFormData({ ...formData, metadata: e.target.value })}
                placeholder="{}"
                className="font-mono h-24"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button variant="hero" onClick={handleSave}>
              {editingId ? "Update" : "Create"} Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
