import Prompt from "@models/prompt";
import { connectToDatabase } from "@utils/database"

export const GET = async (req, { params }) => {
  try {
    await connectToDatabase();
    const prompt = await Prompt.findById(params.id).populate("creator");
    if (!prompt) {
      return new Response("Prompt not found", { status: 404 })
    }
    return new Response(JSON.stringify(prompt), { status: 200 });
  } catch (error) {
    return new Response("Request failed to get prompt", { status: 500 });
  }
}

export const PATCH = async (req, { params }) => {
  const { prompt, tag } = await req.json();

  try {
    await connectToDatabase();

    const existingPrompt = await Prompt.getById(params.id);

    if (!existingPrompt) {
      return new Response("Prompt not found", { status: 404 });
    }
    existingPrompt.prompt = prompt;
    existingPrompt.tag = tag;
    await existingPrompt.save();

    return new Response(JSON.stringify(existingPrompt, { status: 200 }))
  } catch (error) {
    return new Response("Request failed to update prompt", { status: 500 });
  }
}

export const DELETE = async (req, { params }) => {
  try {
    await connectToDatabase();
    await Prompt.findByIdAndDelete(params.id);

    return new Response("Prompt deleted successfully", { status: 200 });
  } catch (error) {
    return new Response("Request failed to delete prompt", { status: 500 });
  }
}