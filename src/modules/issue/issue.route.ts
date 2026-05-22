import { Router } from 'express';
const router = Router();
import { issueController } from './issue.controller';

router.post('/', issueController.createIssue)

export default router;