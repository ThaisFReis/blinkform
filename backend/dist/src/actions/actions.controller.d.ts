import { ActionsService } from './actions.service';
export declare class ActionsController {
    private readonly actionsService;
    constructor(actionsService: ActionsService);
    getAction(formId: string, account?: string): Promise<import("../schema-parser/schema-parser.service").ActionResponse>;
    postAction(formId: string, account: string, body: any): Promise<import("../schema-parser/schema-parser.service").ActionResponse | {
        type: string;
        message: string;
        links: {
            actions: {
                label: string;
                href: string;
            }[];
        };
        icon?: undefined;
        title?: undefined;
        description?: undefined;
        label?: undefined;
    } | {
        type: string;
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
        message?: undefined;
    }>;
}
