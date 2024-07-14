import Prompt from "@models/prompt";
import { connectToDatabase } from "@utils/database";

export const POST = async (req) => {
  const { prompt, userId, tag } = await req.json();
  try {
    await connectToDatabase();
    const newPrompt = new Prompt({ prompt, creator: userId, tag });

    await newPrompt.save();

    return new Response(JSON.stringify(newPrompt), {
      status: 201,
    });
  } catch (error) {
    console.error(error.message);
    return new Response("Failed to create a new prompt", { status: 500 });
  }
}