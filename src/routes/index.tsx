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

function UserRow({ user }: { user: { id: string; email: string; isActive: boolean } }) {
  return (
    <div id={`user-${user.id}`} className="user-row flex items-center gap-2">
      <span>{user.email}</span>
      <label className="flex items-center gap-1">
        <input
          type="checkbox"
          defaultChecked={user.isActive}
          hx-put="/"
          hx-vals={JSON.stringify({ userId: user.id, isActive: !user.isActive })}
          hx-target={`#user-${user.id}`}
          hx-swap="outerHTML"
        />
        Active
      </label>
    </div>
  );
}

export async function PUT(req: Request) {
  const formData = await req.formData();
  const userId = formData.get("userId") as string;
  const isActive = formData.get("isActive") === "true";

  if (!userId) {
    return new Response("User ID is required", { status: 400 });
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { isActive },
  });

  return <UserRow user={updatedUser} />;
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
        <UserRow key={member.id} user={member} />
      ))}
    </div>
  );
}
