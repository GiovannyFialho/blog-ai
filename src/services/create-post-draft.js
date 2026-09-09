import { nanoid } from "nanoid";
import { z } from "zod";

import { ID } from "../mastra/agents/post-writer-agent.js";
import { mastra } from "../mastra/index.js";

const postContentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
});

export async function createPostDraft(idea) {
  const agent = mastra.getAgentById(ID);
  const response = await agent.generate(
    `Create a blog post draft based on the following idea:\n\n${idea}`,
    {
      structuredOutput: {
        schema: postContentSchema,
      },
    },
  );

  const { title, content } = response.object;

  return {
    id: nanoid(),
    title,
    content,
    published_at: null,
    created_at: new Date().toISOString(),
    approved_at: null,
    rejected_at: null,
  };
}
