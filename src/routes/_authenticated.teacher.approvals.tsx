import { createFileRoute } from "@tanstack/react-router";
import { MarkSubmissionApprovals } from "@/components/MarkSubmissionApprovals";

export const Route = createFileRoute("/_authenticated/teacher/approvals")({ component: MarkSubmissionApprovals });
