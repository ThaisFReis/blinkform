import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type SubmissionModel = runtime.Types.Result.DefaultSelection<Prisma.$SubmissionPayload>;
export type AggregateSubmission = {
    _count: SubmissionCountAggregateOutputType | null;
    _min: SubmissionMinAggregateOutputType | null;
    _max: SubmissionMaxAggregateOutputType | null;
};
export type SubmissionMinAggregateOutputType = {
    id: string | null;
    formId: string | null;
    userAccount: string | null;
    transactionSignature: string | null;
    completedAt: Date | null;
};
export type SubmissionMaxAggregateOutputType = {
    id: string | null;
    formId: string | null;
    userAccount: string | null;
    transactionSignature: string | null;
    completedAt: Date | null;
};
export type SubmissionCountAggregateOutputType = {
    id: number;
    formId: number;
    userAccount: number;
    answers: number;
    transactionSignature: number;
    completedAt: number;
    _all: number;
};
export type SubmissionMinAggregateInputType = {
    id?: true;
    formId?: true;
    userAccount?: true;
    transactionSignature?: true;
    completedAt?: true;
};
export type SubmissionMaxAggregateInputType = {
    id?: true;
    formId?: true;
    userAccount?: true;
    transactionSignature?: true;
    completedAt?: true;
};
export type SubmissionCountAggregateInputType = {
    id?: true;
    formId?: true;
    userAccount?: true;
    answers?: true;
    transactionSignature?: true;
    completedAt?: true;
    _all?: true;
};
export type SubmissionAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SubmissionWhereInput;
    orderBy?: Prisma.SubmissionOrderByWithRelationInput | Prisma.SubmissionOrderByWithRelationInput[];
    cursor?: Prisma.SubmissionWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | SubmissionCountAggregateInputType;
    _min?: SubmissionMinAggregateInputType;
    _max?: SubmissionMaxAggregateInputType;
};
export type GetSubmissionAggregateType<T extends SubmissionAggregateArgs> = {
    [P in keyof T & keyof AggregateSubmission]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateSubmission[P]> : Prisma.GetScalarType<T[P], AggregateSubmission[P]>;
};
export type SubmissionGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SubmissionWhereInput;
    orderBy?: Prisma.SubmissionOrderByWithAggregationInput | Prisma.SubmissionOrderByWithAggregationInput[];
    by: Prisma.SubmissionScalarFieldEnum[] | Prisma.SubmissionScalarFieldEnum;
    having?: Prisma.SubmissionScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: SubmissionCountAggregateInputType | true;
    _min?: SubmissionMinAggregateInputType;
    _max?: SubmissionMaxAggregateInputType;
};
export type SubmissionGroupByOutputType = {
    id: string;
    formId: string;
    userAccount: string;
    answers: runtime.JsonValue;
    transactionSignature: string | null;
    completedAt: Date;
    _count: SubmissionCountAggregateOutputType | null;
    _min: SubmissionMinAggregateOutputType | null;
    _max: SubmissionMaxAggregateOutputType | null;
};
type GetSubmissionGroupByPayload<T extends SubmissionGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<SubmissionGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof SubmissionGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], SubmissionGroupByOutputType[P]> : Prisma.GetScalarType<T[P], SubmissionGroupByOutputType[P]>;
}>>;
export type SubmissionWhereInput = {
    AND?: Prisma.SubmissionWhereInput | Prisma.SubmissionWhereInput[];
    OR?: Prisma.SubmissionWhereInput[];
    NOT?: Prisma.SubmissionWhereInput | Prisma.SubmissionWhereInput[];
    id?: Prisma.UuidFilter<"Submission"> | string;
    formId?: Prisma.UuidFilter<"Submission"> | string;
    userAccount?: Prisma.StringFilter<"Submission"> | string;
    answers?: Prisma.JsonFilter<"Submission">;
    transactionSignature?: Prisma.StringNullableFilter<"Submission"> | string | null;
    completedAt?: Prisma.DateTimeFilter<"Submission"> | Date | string;
    form?: Prisma.XOR<Prisma.FormScalarRelationFilter, Prisma.FormWhereInput>;
};
export type SubmissionOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    formId?: Prisma.SortOrder;
    userAccount?: Prisma.SortOrder;
    answers?: Prisma.SortOrder;
    transactionSignature?: Prisma.SortOrderInput | Prisma.SortOrder;
    completedAt?: Prisma.SortOrder;
    form?: Prisma.FormOrderByWithRelationInput;
};
export type SubmissionWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.SubmissionWhereInput | Prisma.SubmissionWhereInput[];
    OR?: Prisma.SubmissionWhereInput[];
    NOT?: Prisma.SubmissionWhereInput | Prisma.SubmissionWhereInput[];
    formId?: Prisma.UuidFilter<"Submission"> | string;
    userAccount?: Prisma.StringFilter<"Submission"> | string;
    answers?: Prisma.JsonFilter<"Submission">;
    transactionSignature?: Prisma.StringNullableFilter<"Submission"> | string | null;
    completedAt?: Prisma.DateTimeFilter<"Submission"> | Date | string;
    form?: Prisma.XOR<Prisma.FormScalarRelationFilter, Prisma.FormWhereInput>;
}, "id">;
export type SubmissionOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    formId?: Prisma.SortOrder;
    userAccount?: Prisma.SortOrder;
    answers?: Prisma.SortOrder;
    transactionSignature?: Prisma.SortOrderInput | Prisma.SortOrder;
    completedAt?: Prisma.SortOrder;
    _count?: Prisma.SubmissionCountOrderByAggregateInput;
    _max?: Prisma.SubmissionMaxOrderByAggregateInput;
    _min?: Prisma.SubmissionMinOrderByAggregateInput;
};
export type SubmissionScalarWhereWithAggregatesInput = {
    AND?: Prisma.SubmissionScalarWhereWithAggregatesInput | Prisma.SubmissionScalarWhereWithAggregatesInput[];
    OR?: Prisma.SubmissionScalarWhereWithAggregatesInput[];
    NOT?: Prisma.SubmissionScalarWhereWithAggregatesInput | Prisma.SubmissionScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"Submission"> | string;
    formId?: Prisma.UuidWithAggregatesFilter<"Submission"> | string;
    userAccount?: Prisma.StringWithAggregatesFilter<"Submission"> | string;
    answers?: Prisma.JsonWithAggregatesFilter<"Submission">;
    transactionSignature?: Prisma.StringNullableWithAggregatesFilter<"Submission"> | string | null;
    completedAt?: Prisma.DateTimeWithAggregatesFilter<"Submission"> | Date | string;
};
export type SubmissionCreateInput = {
    id?: string;
    userAccount: string;
    answers: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    transactionSignature?: string | null;
    completedAt?: Date | string;
    form: Prisma.FormCreateNestedOneWithoutSubmissionsInput;
};
export type SubmissionUncheckedCreateInput = {
    id?: string;
    formId: string;
    userAccount: string;
    answers: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    transactionSignature?: string | null;
    completedAt?: Date | string;
};
export type SubmissionUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userAccount?: Prisma.StringFieldUpdateOperationsInput | string;
    answers?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    transactionSignature?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    completedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    form?: Prisma.FormUpdateOneRequiredWithoutSubmissionsNestedInput;
};
export type SubmissionUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    formId?: Prisma.StringFieldUpdateOperationsInput | string;
    userAccount?: Prisma.StringFieldUpdateOperationsInput | string;
    answers?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    transactionSignature?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    completedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SubmissionCreateManyInput = {
    id?: string;
    formId: string;
    userAccount: string;
    answers: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    transactionSignature?: string | null;
    completedAt?: Date | string;
};
export type SubmissionUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userAccount?: Prisma.StringFieldUpdateOperationsInput | string;
    answers?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    transactionSignature?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    completedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SubmissionUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    formId?: Prisma.StringFieldUpdateOperationsInput | string;
    userAccount?: Prisma.StringFieldUpdateOperationsInput | string;
    answers?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    transactionSignature?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    completedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SubmissionListRelationFilter = {
    every?: Prisma.SubmissionWhereInput;
    some?: Prisma.SubmissionWhereInput;
    none?: Prisma.SubmissionWhereInput;
};
export type SubmissionOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type SubmissionCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    formId?: Prisma.SortOrder;
    userAccount?: Prisma.SortOrder;
    answers?: Prisma.SortOrder;
    transactionSignature?: Prisma.SortOrder;
    completedAt?: Prisma.SortOrder;
};
export type SubmissionMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    formId?: Prisma.SortOrder;
    userAccount?: Prisma.SortOrder;
    transactionSignature?: Prisma.SortOrder;
    completedAt?: Prisma.SortOrder;
};
export type SubmissionMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    formId?: Prisma.SortOrder;
    userAccount?: Prisma.SortOrder;
    transactionSignature?: Prisma.SortOrder;
    completedAt?: Prisma.SortOrder;
};
export type SubmissionCreateNestedManyWithoutFormInput = {
    create?: Prisma.XOR<Prisma.SubmissionCreateWithoutFormInput, Prisma.SubmissionUncheckedCreateWithoutFormInput> | Prisma.SubmissionCreateWithoutFormInput[] | Prisma.SubmissionUncheckedCreateWithoutFormInput[];
    connectOrCreate?: Prisma.SubmissionCreateOrConnectWithoutFormInput | Prisma.SubmissionCreateOrConnectWithoutFormInput[];
    createMany?: Prisma.SubmissionCreateManyFormInputEnvelope;
    connect?: Prisma.SubmissionWhereUniqueInput | Prisma.SubmissionWhereUniqueInput[];
};
export type SubmissionUncheckedCreateNestedManyWithoutFormInput = {
    create?: Prisma.XOR<Prisma.SubmissionCreateWithoutFormInput, Prisma.SubmissionUncheckedCreateWithoutFormInput> | Prisma.SubmissionCreateWithoutFormInput[] | Prisma.SubmissionUncheckedCreateWithoutFormInput[];
    connectOrCreate?: Prisma.SubmissionCreateOrConnectWithoutFormInput | Prisma.SubmissionCreateOrConnectWithoutFormInput[];
    createMany?: Prisma.SubmissionCreateManyFormInputEnvelope;
    connect?: Prisma.SubmissionWhereUniqueInput | Prisma.SubmissionWhereUniqueInput[];
};
export type SubmissionUpdateManyWithoutFormNestedInput = {
    create?: Prisma.XOR<Prisma.SubmissionCreateWithoutFormInput, Prisma.SubmissionUncheckedCreateWithoutFormInput> | Prisma.SubmissionCreateWithoutFormInput[] | Prisma.SubmissionUncheckedCreateWithoutFormInput[];
    connectOrCreate?: Prisma.SubmissionCreateOrConnectWithoutFormInput | Prisma.SubmissionCreateOrConnectWithoutFormInput[];
    upsert?: Prisma.SubmissionUpsertWithWhereUniqueWithoutFormInput | Prisma.SubmissionUpsertWithWhereUniqueWithoutFormInput[];
    createMany?: Prisma.SubmissionCreateManyFormInputEnvelope;
    set?: Prisma.SubmissionWhereUniqueInput | Prisma.SubmissionWhereUniqueInput[];
    disconnect?: Prisma.SubmissionWhereUniqueInput | Prisma.SubmissionWhereUniqueInput[];
    delete?: Prisma.SubmissionWhereUniqueInput | Prisma.SubmissionWhereUniqueInput[];
    connect?: Prisma.SubmissionWhereUniqueInput | Prisma.SubmissionWhereUniqueInput[];
    update?: Prisma.SubmissionUpdateWithWhereUniqueWithoutFormInput | Prisma.SubmissionUpdateWithWhereUniqueWithoutFormInput[];
    updateMany?: Prisma.SubmissionUpdateManyWithWhereWithoutFormInput | Prisma.SubmissionUpdateManyWithWhereWithoutFormInput[];
    deleteMany?: Prisma.SubmissionScalarWhereInput | Prisma.SubmissionScalarWhereInput[];
};
export type SubmissionUncheckedUpdateManyWithoutFormNestedInput = {
    create?: Prisma.XOR<Prisma.SubmissionCreateWithoutFormInput, Prisma.SubmissionUncheckedCreateWithoutFormInput> | Prisma.SubmissionCreateWithoutFormInput[] | Prisma.SubmissionUncheckedCreateWithoutFormInput[];
    connectOrCreate?: Prisma.SubmissionCreateOrConnectWithoutFormInput | Prisma.SubmissionCreateOrConnectWithoutFormInput[];
    upsert?: Prisma.SubmissionUpsertWithWhereUniqueWithoutFormInput | Prisma.SubmissionUpsertWithWhereUniqueWithoutFormInput[];
    createMany?: Prisma.SubmissionCreateManyFormInputEnvelope;
    set?: Prisma.SubmissionWhereUniqueInput | Prisma.SubmissionWhereUniqueInput[];
    disconnect?: Prisma.SubmissionWhereUniqueInput | Prisma.SubmissionWhereUniqueInput[];
    delete?: Prisma.SubmissionWhereUniqueInput | Prisma.SubmissionWhereUniqueInput[];
    connect?: Prisma.SubmissionWhereUniqueInput | Prisma.SubmissionWhereUniqueInput[];
    update?: Prisma.SubmissionUpdateWithWhereUniqueWithoutFormInput | Prisma.SubmissionUpdateWithWhereUniqueWithoutFormInput[];
    updateMany?: Prisma.SubmissionUpdateManyWithWhereWithoutFormInput | Prisma.SubmissionUpdateManyWithWhereWithoutFormInput[];
    deleteMany?: Prisma.SubmissionScalarWhereInput | Prisma.SubmissionScalarWhereInput[];
};
export type SubmissionCreateWithoutFormInput = {
    id?: string;
    userAccount: string;
    answers: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    transactionSignature?: string | null;
    completedAt?: Date | string;
};
export type SubmissionUncheckedCreateWithoutFormInput = {
    id?: string;
    userAccount: string;
    answers: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    transactionSignature?: string | null;
    completedAt?: Date | string;
};
export type SubmissionCreateOrConnectWithoutFormInput = {
    where: Prisma.SubmissionWhereUniqueInput;
    create: Prisma.XOR<Prisma.SubmissionCreateWithoutFormInput, Prisma.SubmissionUncheckedCreateWithoutFormInput>;
};
export type SubmissionCreateManyFormInputEnvelope = {
    data: Prisma.SubmissionCreateManyFormInput | Prisma.SubmissionCreateManyFormInput[];
    skipDuplicates?: boolean;
};
export type SubmissionUpsertWithWhereUniqueWithoutFormInput = {
    where: Prisma.SubmissionWhereUniqueInput;
    update: Prisma.XOR<Prisma.SubmissionUpdateWithoutFormInput, Prisma.SubmissionUncheckedUpdateWithoutFormInput>;
    create: Prisma.XOR<Prisma.SubmissionCreateWithoutFormInput, Prisma.SubmissionUncheckedCreateWithoutFormInput>;
};
export type SubmissionUpdateWithWhereUniqueWithoutFormInput = {
    where: Prisma.SubmissionWhereUniqueInput;
    data: Prisma.XOR<Prisma.SubmissionUpdateWithoutFormInput, Prisma.SubmissionUncheckedUpdateWithoutFormInput>;
};
export type SubmissionUpdateManyWithWhereWithoutFormInput = {
    where: Prisma.SubmissionScalarWhereInput;
    data: Prisma.XOR<Prisma.SubmissionUpdateManyMutationInput, Prisma.SubmissionUncheckedUpdateManyWithoutFormInput>;
};
export type SubmissionScalarWhereInput = {
    AND?: Prisma.SubmissionScalarWhereInput | Prisma.SubmissionScalarWhereInput[];
    OR?: Prisma.SubmissionScalarWhereInput[];
    NOT?: Prisma.SubmissionScalarWhereInput | Prisma.SubmissionScalarWhereInput[];
    id?: Prisma.UuidFilter<"Submission"> | string;
    formId?: Prisma.UuidFilter<"Submission"> | string;
    userAccount?: Prisma.StringFilter<"Submission"> | string;
    answers?: Prisma.JsonFilter<"Submission">;
    transactionSignature?: Prisma.StringNullableFilter<"Submission"> | string | null;
    completedAt?: Prisma.DateTimeFilter<"Submission"> | Date | string;
};
export type SubmissionCreateManyFormInput = {
    id?: string;
    userAccount: string;
    answers: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    transactionSignature?: string | null;
    completedAt?: Date | string;
};
export type SubmissionUpdateWithoutFormInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userAccount?: Prisma.StringFieldUpdateOperationsInput | string;
    answers?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    transactionSignature?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    completedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SubmissionUncheckedUpdateWithoutFormInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userAccount?: Prisma.StringFieldUpdateOperationsInput | string;
    answers?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    transactionSignature?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    completedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SubmissionUncheckedUpdateManyWithoutFormInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userAccount?: Prisma.StringFieldUpdateOperationsInput | string;
    answers?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    transactionSignature?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    completedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SubmissionSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    formId?: boolean;
    userAccount?: boolean;
    answers?: boolean;
    transactionSignature?: boolean;
    completedAt?: boolean;
    form?: boolean | Prisma.FormDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["submission"]>;
export type SubmissionSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    formId?: boolean;
    userAccount?: boolean;
    answers?: boolean;
    transactionSignature?: boolean;
    completedAt?: boolean;
    form?: boolean | Prisma.FormDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["submission"]>;
export type SubmissionSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    formId?: boolean;
    userAccount?: boolean;
    answers?: boolean;
    transactionSignature?: boolean;
    completedAt?: boolean;
    form?: boolean | Prisma.FormDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["submission"]>;
export type SubmissionSelectScalar = {
    id?: boolean;
    formId?: boolean;
    userAccount?: boolean;
    answers?: boolean;
    transactionSignature?: boolean;
    completedAt?: boolean;
};
export type SubmissionOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "formId" | "userAccount" | "answers" | "transactionSignature" | "completedAt", ExtArgs["result"]["submission"]>;
export type SubmissionInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    form?: boolean | Prisma.FormDefaultArgs<ExtArgs>;
};
export type SubmissionIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    form?: boolean | Prisma.FormDefaultArgs<ExtArgs>;
};
export type SubmissionIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    form?: boolean | Prisma.FormDefaultArgs<ExtArgs>;
};
export type $SubmissionPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Submission";
    objects: {
        form: Prisma.$FormPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        formId: string;
        userAccount: string;
        answers: runtime.JsonValue;
        transactionSignature: string | null;
        completedAt: Date;
    }, ExtArgs["result"]["submission"]>;
    composites: {};
};
export type SubmissionGetPayload<S extends boolean | null | undefined | SubmissionDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$SubmissionPayload, S>;
export type SubmissionCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<SubmissionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: SubmissionCountAggregateInputType | true;
};
export interface SubmissionDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Submission'];
        meta: {
            name: 'Submission';
        };
    };
    findUnique<T extends SubmissionFindUniqueArgs>(args: Prisma.SelectSubset<T, SubmissionFindUniqueArgs<ExtArgs>>): Prisma.Prisma__SubmissionClient<runtime.Types.Result.GetResult<Prisma.$SubmissionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends SubmissionFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, SubmissionFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__SubmissionClient<runtime.Types.Result.GetResult<Prisma.$SubmissionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends SubmissionFindFirstArgs>(args?: Prisma.SelectSubset<T, SubmissionFindFirstArgs<ExtArgs>>): Prisma.Prisma__SubmissionClient<runtime.Types.Result.GetResult<Prisma.$SubmissionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends SubmissionFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, SubmissionFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__SubmissionClient<runtime.Types.Result.GetResult<Prisma.$SubmissionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends SubmissionFindManyArgs>(args?: Prisma.SelectSubset<T, SubmissionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SubmissionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends SubmissionCreateArgs>(args: Prisma.SelectSubset<T, SubmissionCreateArgs<ExtArgs>>): Prisma.Prisma__SubmissionClient<runtime.Types.Result.GetResult<Prisma.$SubmissionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends SubmissionCreateManyArgs>(args?: Prisma.SelectSubset<T, SubmissionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends SubmissionCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, SubmissionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SubmissionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends SubmissionDeleteArgs>(args: Prisma.SelectSubset<T, SubmissionDeleteArgs<ExtArgs>>): Prisma.Prisma__SubmissionClient<runtime.Types.Result.GetResult<Prisma.$SubmissionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends SubmissionUpdateArgs>(args: Prisma.SelectSubset<T, SubmissionUpdateArgs<ExtArgs>>): Prisma.Prisma__SubmissionClient<runtime.Types.Result.GetResult<Prisma.$SubmissionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends SubmissionDeleteManyArgs>(args?: Prisma.SelectSubset<T, SubmissionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends SubmissionUpdateManyArgs>(args: Prisma.SelectSubset<T, SubmissionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends SubmissionUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, SubmissionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SubmissionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends SubmissionUpsertArgs>(args: Prisma.SelectSubset<T, SubmissionUpsertArgs<ExtArgs>>): Prisma.Prisma__SubmissionClient<runtime.Types.Result.GetResult<Prisma.$SubmissionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends SubmissionCountArgs>(args?: Prisma.Subset<T, SubmissionCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], SubmissionCountAggregateOutputType> : number>;
    aggregate<T extends SubmissionAggregateArgs>(args: Prisma.Subset<T, SubmissionAggregateArgs>): Prisma.PrismaPromise<GetSubmissionAggregateType<T>>;
    groupBy<T extends SubmissionGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: SubmissionGroupByArgs['orderBy'];
    } : {
        orderBy?: SubmissionGroupByArgs['orderBy'];
    }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<T['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<T['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True ? `Error: "by" must not be empty.` : HavingValid extends Prisma.False ? {
        [P in HavingFields]: P extends ByFields ? never : P extends string ? `Error: Field "${P}" used in "having" needs to be provided in "by".` : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`
        ];
    }[HavingFields] : 'take' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "take", you also need to provide "orderBy"' : 'skip' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "skip", you also need to provide "orderBy"' : ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, SubmissionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSubmissionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: SubmissionFieldRefs;
}
export interface Prisma__SubmissionClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    form<T extends Prisma.FormDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.FormDefaultArgs<ExtArgs>>): Prisma.Prisma__FormClient<runtime.Types.Result.GetResult<Prisma.$FormPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface SubmissionFieldRefs {
    readonly id: Prisma.FieldRef<"Submission", 'String'>;
    readonly formId: Prisma.FieldRef<"Submission", 'String'>;
    readonly userAccount: Prisma.FieldRef<"Submission", 'String'>;
    readonly answers: Prisma.FieldRef<"Submission", 'Json'>;
    readonly transactionSignature: Prisma.FieldRef<"Submission", 'String'>;
    readonly completedAt: Prisma.FieldRef<"Submission", 'DateTime'>;
}
export type SubmissionFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubmissionSelect<ExtArgs> | null;
    omit?: Prisma.SubmissionOmit<ExtArgs> | null;
    include?: Prisma.SubmissionInclude<ExtArgs> | null;
    where: Prisma.SubmissionWhereUniqueInput;
};
export type SubmissionFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubmissionSelect<ExtArgs> | null;
    omit?: Prisma.SubmissionOmit<ExtArgs> | null;
    include?: Prisma.SubmissionInclude<ExtArgs> | null;
    where: Prisma.SubmissionWhereUniqueInput;
};
export type SubmissionFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubmissionSelect<ExtArgs> | null;
    omit?: Prisma.SubmissionOmit<ExtArgs> | null;
    include?: Prisma.SubmissionInclude<ExtArgs> | null;
    where?: Prisma.SubmissionWhereInput;
    orderBy?: Prisma.SubmissionOrderByWithRelationInput | Prisma.SubmissionOrderByWithRelationInput[];
    cursor?: Prisma.SubmissionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.SubmissionScalarFieldEnum | Prisma.SubmissionScalarFieldEnum[];
};
export type SubmissionFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubmissionSelect<ExtArgs> | null;
    omit?: Prisma.SubmissionOmit<ExtArgs> | null;
    include?: Prisma.SubmissionInclude<ExtArgs> | null;
    where?: Prisma.SubmissionWhereInput;
    orderBy?: Prisma.SubmissionOrderByWithRelationInput | Prisma.SubmissionOrderByWithRelationInput[];
    cursor?: Prisma.SubmissionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.SubmissionScalarFieldEnum | Prisma.SubmissionScalarFieldEnum[];
};
export type SubmissionFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubmissionSelect<ExtArgs> | null;
    omit?: Prisma.SubmissionOmit<ExtArgs> | null;
    include?: Prisma.SubmissionInclude<ExtArgs> | null;
    where?: Prisma.SubmissionWhereInput;
    orderBy?: Prisma.SubmissionOrderByWithRelationInput | Prisma.SubmissionOrderByWithRelationInput[];
    cursor?: Prisma.SubmissionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.SubmissionScalarFieldEnum | Prisma.SubmissionScalarFieldEnum[];
};
export type SubmissionCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubmissionSelect<ExtArgs> | null;
    omit?: Prisma.SubmissionOmit<ExtArgs> | null;
    include?: Prisma.SubmissionInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.SubmissionCreateInput, Prisma.SubmissionUncheckedCreateInput>;
};
export type SubmissionCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.SubmissionCreateManyInput | Prisma.SubmissionCreateManyInput[];
    skipDuplicates?: boolean;
};
export type SubmissionCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubmissionSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.SubmissionOmit<ExtArgs> | null;
    data: Prisma.SubmissionCreateManyInput | Prisma.SubmissionCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.SubmissionIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type SubmissionUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubmissionSelect<ExtArgs> | null;
    omit?: Prisma.SubmissionOmit<ExtArgs> | null;
    include?: Prisma.SubmissionInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.SubmissionUpdateInput, Prisma.SubmissionUncheckedUpdateInput>;
    where: Prisma.SubmissionWhereUniqueInput;
};
export type SubmissionUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.SubmissionUpdateManyMutationInput, Prisma.SubmissionUncheckedUpdateManyInput>;
    where?: Prisma.SubmissionWhereInput;
    limit?: number;
};
export type SubmissionUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubmissionSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.SubmissionOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.SubmissionUpdateManyMutationInput, Prisma.SubmissionUncheckedUpdateManyInput>;
    where?: Prisma.SubmissionWhereInput;
    limit?: number;
    include?: Prisma.SubmissionIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type SubmissionUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubmissionSelect<ExtArgs> | null;
    omit?: Prisma.SubmissionOmit<ExtArgs> | null;
    include?: Prisma.SubmissionInclude<ExtArgs> | null;
    where: Prisma.SubmissionWhereUniqueInput;
    create: Prisma.XOR<Prisma.SubmissionCreateInput, Prisma.SubmissionUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.SubmissionUpdateInput, Prisma.SubmissionUncheckedUpdateInput>;
};
export type SubmissionDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubmissionSelect<ExtArgs> | null;
    omit?: Prisma.SubmissionOmit<ExtArgs> | null;
    include?: Prisma.SubmissionInclude<ExtArgs> | null;
    where: Prisma.SubmissionWhereUniqueInput;
};
export type SubmissionDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SubmissionWhereInput;
    limit?: number;
};
export type SubmissionDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubmissionSelect<ExtArgs> | null;
    omit?: Prisma.SubmissionOmit<ExtArgs> | null;
    include?: Prisma.SubmissionInclude<ExtArgs> | null;
};
export {};
