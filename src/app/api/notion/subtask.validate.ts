import { z } from 'zod';

// Schemas auxiliares
const parentSchema = z.object({
    database_id: z.string()
});

const iconSchema = z.object({
    emoji: z.string().optional()
});

const coverSchema = z.object({
    external: z.object({
        url: z.string().url().optional()
    })
});

const textContentSchema = z.object({
    text: z.object({
        content: z.string()
    })
});

const titleSchema = z.array(textContentSchema);

const dateSchema = z.object({
    date: z.object({
        start: z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
    })
});

const multiSelectSchema = z.object({
    multi_select: z.array(
        z.object({
            name: z.string(),
            color: z.string().optional().optional()
        })
    )
});

const estimatedTimeSchema = z.object({
    number: z.number().positive()
});

const tasksSchema = z.object({
    relation: z.array(
        z.object({
            id: z.string()
        }).optional()
    )
});

// Schema principal
const PostSubTaskSchema = z.object({
    parent: parentSchema,
    icon: iconSchema.optional(),
    cover: coverSchema.optional(),
    properties: z.object({
        Name: z.object({
            title: titleSchema
        }),
        Date: dateSchema,
        "Week Day": multiSelectSchema,
        "Estimated Time": estimatedTimeSchema,
        Tasks: tasksSchema.optional()
    })
});

// Tipo inferido do schema
type NotionData = z.infer<typeof PostSubTaskSchema>;

// Exemplo de uso
export const postSubTaskSchema = (data: any) => {
    return PostSubTaskSchema.safeParse(data);
};
