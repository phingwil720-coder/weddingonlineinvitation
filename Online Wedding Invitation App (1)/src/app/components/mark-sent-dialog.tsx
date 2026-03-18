import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';

interface MarkSentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  guestName: string;
  onConfirm: () => void;
}

export function MarkSentDialog({ open, onOpenChange, guestName, onConfirm }: MarkSentDialogProps) {
  const [dontAskAgain, setDontAskAgain] = useState(false);

  useEffect(() => {
    // Check if user has opted out of this dialog
    const preference = localStorage.getItem('skip_mark_sent_dialog');
    if (preference === 'true' && open) {
      // Auto-confirm and close if they don't want to be asked
      onConfirm();
      onOpenChange(false);
    }
  }, [open, onConfirm, onOpenChange]);

  const handleConfirm = () => {
    if (dontAskAgain) {
      localStorage.setItem('skip_mark_sent_dialog', 'true');
    }
    onConfirm();
    onOpenChange(false);
  };

  const handleCancel = () => {
    if (dontAskAgain) {
      localStorage.setItem('skip_mark_sent_dialog', 'true');
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Mark as Sent?</DialogTitle>
          <DialogDescription>
            Would you like to mark the invitation for <strong>{guestName}</strong> as sent?
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="dont-ask"
              checked={dontAskAgain}
              onCheckedChange={(checked) => setDontAskAgain(checked === true)}
            />
            <Label
              htmlFor="dont-ask"
              className="text-sm font-normal cursor-pointer"
            >
              Don't ask me again (auto-mark as sent)
            </Label>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <Button variant="outline" onClick={handleCancel}>
            No, Maybe Later
          </Button>
          <Button onClick={handleConfirm}>
            Yes, Mark as Sent ✓
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
