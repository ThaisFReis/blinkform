import { Controller, Get, Post, Put, Body, Param, Query, Header } from '@nestjs/common';
import { FormsService } from './forms.service';
import { ActionsService } from '../actions/actions.service';
import type { CreateFormDto, UpdateFormDto } from './forms.service';

interface SubmitFormDto {
  responses: Record<string, any>;
  userAccount?: string;
}

@Controller('forms')
export class FormsController {
  constructor(
    private readonly formsService: FormsService,
    private readonly actionsService: ActionsService,
  ) {}

  @Post()
  async create(@Body() createFormDto: CreateFormDto) {
    return this.formsService.create(createFormDto);
  }

  @Get(':id')
  @Header('Content-Type', 'application/json')
  @Header('Access-Control-Allow-Origin', '*')
  @Header('Access-Control-Allow-Methods', 'GET,POST,PUT,OPTIONS')
  @Header('Access-Control-Allow-Headers', 'Content-Type,Authorization,Content-Encoding,Accept-Encoding')
  @Header('X-Action-Version', '2.0')
  @Header('X-Blockchain-Ids', 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp')
  async findOne(@Param('id') id: string, @Query('account') account?: string) {
    return this.actionsService.getAction(id, account);
  }

  @Post(':id')
  @Header('Content-Type', 'application/json')
  @Header('Access-Control-Allow-Origin', '*')
  @Header('Access-Control-Allow-Methods', 'GET,POST,PUT,OPTIONS')
  @Header('Access-Control-Allow-Headers', 'Content-Type,Authorization,Content-Encoding,Accept-Encoding')
  @Header('X-Action-Version', '2.0')
  @Header('X-Blockchain-Ids', 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp')
  async postAction(
    @Param('id') id: string,
    @Query() query: Record<string, any>,
    @Body() body: any,
  ) {
    // Account comes from the body in Solana Actions
    const account = body.account || body.data?.account;
    return this.actionsService.postAction(id, account, body, query);
  }

  @Post(':id/:choice')
  @Header('Content-Type', 'application/json')
  @Header('Access-Control-Allow-Origin', '*')
  @Header('Access-Control-Allow-Methods', 'GET,POST,PUT,OPTIONS')
  @Header('Access-Control-Allow-Headers', 'Content-Type,Authorization,Content-Encoding,Accept-Encoding')
  @Header('X-Action-Version', '2.0')
  @Header('X-Blockchain-Ids', 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp')
  async postActionWithChoice(
    @Param('id') id: string,
    @Param('choice') choice: string,
    @Query() query: Record<string, any>,
    @Body() body: any,
  ) {
    // Account comes from the body in Solana Actions
    const account = body.account || body.data?.account;
    // Merge choice into query for unified handling
    const enrichedQuery = { ...query, choice };
    return this.actionsService.postAction(id, account, body, enrichedQuery);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateFormDto: UpdateFormDto) {
    return this.formsService.update(id, updateFormDto);
  }

  @Post(':id/submit')
  async submit(@Param('id') id: string, @Body() submitFormDto: SubmitFormDto) {
    return this.formsService.submit(id, submitFormDto);
  }

  @Post('complete')
  @Header('Content-Type', 'application/json')
  @Header('Access-Control-Allow-Origin', '*')
  @Header('Access-Control-Allow-Methods', 'GET,POST,PUT,OPTIONS')
  @Header('Access-Control-Allow-Headers', 'Content-Type,Authorization,Content-Encoding,Accept-Encoding')
  @Header('X-Action-Version', '2.0')
  @Header('X-Blockchain-Ids', 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp')
  async complete(@Body() body: any) {
    // This endpoint handles form completion without transactions
    // The form data should be passed in the body
    const formId = body.formId;
    const responses = body.responses || {};
    const userAccount = body.account || 'anonymous';

    console.log('[Forms Complete] Completing form:', formId, 'Account:', userAccount);

    // Save the submission
    const result = await this.formsService.submit(formId, {
      responses,
      userAccount,
    });

    // Return success response
    return {
      type: 'completed',
      title: 'Form Completed',
      description: 'Thank you for completing the form!',
      icon: 'https://via.placeholder.com/600x400/10B981/FFFFFF?text=Completed',
      label: 'Done',
    };
  }

  @Get()
  async findAllByCreator(@Query('creator') creatorAddress: string) {
    return this.formsService.findAllByCreator(creatorAddress);
  }
}
