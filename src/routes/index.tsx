import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/mwm-ui/accordion";
import { Alert, AlertTitle, AlertDescription } from "@/components/mwm-ui/alert";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/mwm-ui/alert-dialog";
import { Button, buttonVariants } from "@/components/mwm-ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/mwm-ui/dialog";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/mwm-ui/popover";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
} from "@/components/mwm-ui/sheet";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
} from "@/components/mwm-ui/drawer";
import { AlertCircle, Terminal } from "lucide-react";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  const formData = await req.formData();
  const email = formData.get("email") as string;

  if (!email) {
    return new Response("Email is required", { status: 400 });
  }

  try {
    await prisma.user.create({
      data: {
        email,
      },
    });

    // Redirect back to the page to see the updated list
    return new Response(null, {
      status: 303,
      headers: { Location: "/" },
    });
  } catch (error) {
    // Return either with cookie set or error query param
    // Handle unique constraint violation
    if ((error as { code?: string }).code === "P2002") {
      return new Response("Email already exists", { status: 409 });
    }
    throw error;
  }
}

export default async function HomePage() {
  const members = await prisma.user.findMany({});

  return (
    <div>
      <form method="POST">
        <input type="email" name="email" placeholder="Email" />
        <button type="submit">Submit</button>
      </form>
      {members.map((member) => (
        <div key={member.id}>{member.email}</div>
      ))}
    </div>
  );
}
