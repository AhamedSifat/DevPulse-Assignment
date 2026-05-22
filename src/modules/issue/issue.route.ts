import { Router } from 'express';
import { issueController } from './issue.controller';
import { authenticate } from '../../middleware/auth';
const router = Router();

router.post('/', authenticate, issueController.createIssue)

export default router;