import { Router } from 'express';
import { issueController } from './issue.controller';
import { authenticate } from '../../middleware/auth';
const router = Router();

router.post('/', authenticate, issueController.createIssue)
router.get('/', issueController.getIssues)
router.get('/:id', issueController.getIssueById)
router.delete('/:id', issueController.deleteIssue)

export default router;