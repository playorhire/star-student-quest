import { createFileRoute } from "@tanstack/react-router";
import { MarkSubmissionApprovals } from "@/components/MarkSubmissionApprovals";

export const Route = createFileRoute("/_authenticated/super-admin/approvals")({ component: MarkSubmissionApprovals });
