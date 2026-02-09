import { z } from 'zod';

// Project schema for validation
export const ProjectSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string()
    .min(1, 'Project name is required')
    .max(50, 'Project name must be less than 50 characters')
    .regex(/^[a-zA-Z0-9-_]+$/, 'Only letters, numbers, hyphens, and underscores allowed'),
  
  path: z.string().min(1, 'Path is required'),
  template: z.string().min(1, 'Template is required'),
  language: z.string().optional(),
  framework: z.string().optional(),
  description: z.string().max(500).optional(),
  
  // Metadata
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
  
  // Settings
  settings: z.object({
    aiEnabled: z.boolean().default(false),
    autoSave: z.boolean().default(true),
    formatOnSave: z.boolean().default(true)
  }).optional()
});

export type Project = z.infer<typeof ProjectSchema>;

// Template schema
export const TemplateSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  type: z.enum(['frontend', 'backend', 'fullstack', 'mobile']),
  language: z.string(),
  framework: z.string().optional(),
  tags: z.array(z.string()),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  path: z.string()
});

export type Template = z.infer<typeof TemplateSchema>;

// AI Request schema
export const AIRequestSchema = z.object({
  prompt: z.string().min(1, 'Prompt is required').max(1000, 'Prompt too long'),
  context: z.string().optional(),
  language: z.string().default('javascript'),
  temperature: z.number().min(0).max(2).default(0.1),
  maxTokens: z.number().min(1).max(4096).default(512)
});

export type AIRequest = z.infer<typeof AIRequestSchema>;
