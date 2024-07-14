import User from "@models/user";
import { connectToDatabase } from "@utils/database";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  ],
  callbacks: {
    async session({ session }) {
      try {
        await connectToDatabase();
        const sessionUser = await User.findOne({ email: session.user.email });
        console.log("sessionUser==>", sessionUser)
        session.user.id = sessionUser._id.toString();
        return session;
      } catch (error) {
        console.error("Error getting session ==>", error.message);
      }
    },
    async signIn({ profile }) {
      console.log("profile==>", profile)
      try {
        await connectToDatabase();

        // Check if the user is already in the database
        const userExists = await User.findOne({ email: profile.email });

        // If not, create a new user in the database
        if (!userExists) {
          console.log("User does not exist, creating a new user");
          await User.create({
            email: profile.email,
            username: profile.name.replace(" ", "").toLowerCase(),
            image: profile.picture,
          });
        }
        return true;
      } catch (error) {
        console.log("Error checking if user exists/creating new user: ", error.message);
        return false;
      }
    }
  },
})

export { handler as GET, handler as POST };