import { ActionsService } from './actions.service';
export declare class ActionsController {
    private readonly actionsService;
    constructor(actionsService: ActionsService);
    getAction(formId: string, account?: string): Promise<{
        icon: string;
        title: string;
        description: string;
        label: string;
        links: {
            actions: {
                label: string;
                href: string;
            }[];
        };
    }>;
}
