import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type FormModel = runtime.Types.Result.DefaultSelection<Prisma.$FormPayload>;
export type AggregateForm = {
    _count: FormCountAggregateOutputType | null;
    _min: FormMinAggregateOutputType | null;
    _max: FormMaxAggregateOutputType | null;
};
export type FormMinAggregateOutputType = {
    id: string | null;
    creatorAddress: string | null;
    title: string | null;
    description: string | null;
    isActive: boolean | null;
    createdAt: Date | null;
};
export type FormMaxAggregateOutputType = {
    id: string | null;
    creatorAddress: string | null;
    title: string | null;
    description: string | null;
    isActive: boolean | null;
    createdAt: Date | null;
};
export type FormCountAggregateOutputType = {
    id: number;
    creatorAddress: number;
    title: number;
    description: number;
    schema: number;
    isActive: number;
    createdAt: number;
    _all: number;
};
export type FormMinAggregateInputType = {
    id?: true;
    creatorAddress?: true;
    title?: true;
    description?: true;
    isActive?: true;
    createdAt?: true;
};
export type FormMaxAggregateInputType = {
    id?: true;
    creatorAddress?: true;
    title?: true;
    description?: true;
    isActive?: true;
    createdAt?: true;
};
export type FormCountAggregateInputType = {
    id?: true;
    creatorAddress?: true;
    title?: true;
    description?: true;
    schema?: true;
    isActive?: true;
    createdAt?: true;
    _all?: true;
};
export type FormAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.FormWhereInput;
    orderBy?: Prisma.FormOrderByWithRelationInput | Prisma.FormOrderByWithRelationInput[];
    cursor?: Prisma.FormWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | FormCountAggregateInputType;
    _min?: FormMinAggregateInputType;
    _max?: FormMaxAggregateInputType;
};
export type GetFormAggregateType<T extends FormAggregateArgs> = {
    [P in keyof T & keyof AggregateForm]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateForm[P]> : Prisma.GetScalarType<T[P], AggregateForm[P]>;
};
export type FormGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.FormWhereInput;
    orderBy?: Prisma.FormOrderByWithAggregationInput | Prisma.FormOrderByWithAggregationInput[];
    by: Prisma.FormScalarFieldEnum[] | Prisma.FormScalarFieldEnum;
    having?: Prisma.FormScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: FormCountAggregateInputType | true;
    _min?: FormMinAggregateInputType;
    _max?: FormMaxAggregateInputType;
};
export type FormGroupByOutputType = {
    id: string;
    creatorAddress: string;
    title: string;
    description: string | null;
    schema: runtime.JsonValue;
    isActive: boolean;
    createdAt: Date;
    _count: FormCountAggregateOutputType | null;
    _min: FormMinAggregateOutputType | null;
    _max: FormMaxAggregateOutputType | null;
};
type GetFormGroupByPayload<T extends FormGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<FormGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof FormGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], FormGroupByOutputType[P]> : Prisma.GetScalarType<T[P], FormGroupByOutputType[P]>;
}>>;
export type FormWhereInput = {
    AND?: Prisma.FormWhereInput | Prisma.FormWhereInput[];
    OR?: Prisma.FormWhereInput[];
    NOT?: Prisma.FormWhereInput | Prisma.FormWhereInput[];
    id?: Prisma.UuidFilter<"Form"> | string;
    creatorAddress?: Prisma.StringFilter<"Form"> | string;
    title?: Prisma.StringFilter<"Form"> | string;
    description?: Prisma.StringNullableFilter<"Form"> | string | null;
    schema?: Prisma.JsonFilter<"Form">;
    isActive?: Prisma.BoolFilter<"Form"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"Form"> | Date | string;
    submissions?: Prisma.SubmissionListRelationFilter;
};
export type FormOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    creatorAddress?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    description?: Prisma.SortOrderInput | Prisma.SortOrder;
    schema?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    submissions?: Prisma.SubmissionOrderByRelationAggregateInput;
};
export type FormWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.FormWhereInput | Prisma.FormWhereInput[];
    OR?: Prisma.FormWhereInput[];
    NOT?: Prisma.FormWhereInput | Prisma.FormWhereInput[];
    creatorAddress?: Prisma.StringFilter<"Form"> | string;
    title?: Prisma.StringFilter<"Form"> | string;
    description?: Prisma.StringNullableFilter<"Form"> | string | null;
    schema?: Prisma.JsonFilter<"Form">;
    isActive?: Prisma.BoolFilter<"Form"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"Form"> | Date | string;
    submissions?: Prisma.SubmissionListRelationFilter;
}, "id">;
export type FormOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    creatorAddress?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    description?: Prisma.SortOrderInput | Prisma.SortOrder;
    schema?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.FormCountOrderByAggregateInput;
    _max?: Prisma.FormMaxOrderByAggregateInput;
    _min?: Prisma.FormMinOrderByAggregateInput;
};
export type FormScalarWhereWithAggregatesInput = {
    AND?: Prisma.FormScalarWhereWithAggregatesInput | Prisma.FormScalarWhereWithAggregatesInput[];
    OR?: Prisma.FormScalarWhereWithAggregatesInput[];
    NOT?: Prisma.FormScalarWhereWithAggregatesInput | Prisma.FormScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"Form"> | string;
    creatorAddress?: Prisma.StringWithAggregatesFilter<"Form"> | string;
    title?: Prisma.StringWithAggregatesFilter<"Form"> | string;
    description?: Prisma.StringNullableWithAggregatesFilter<"Form"> | string | null;
    schema?: Prisma.JsonWithAggregatesFilter<"Form">;
    isActive?: Prisma.BoolWithAggregatesFilter<"Form"> | boolean;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Form"> | Date | string;
};
export type FormCreateInput = {
    id?: string;
    creatorAddress: string;
    title: string;
    description?: string | null;
    schema: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    isActive?: boolean;
    createdAt?: Date | string;
    submissions?: Prisma.SubmissionCreateNestedManyWithoutFormInput;
};
export type FormUncheckedCreateInput = {
    id?: string;
    creatorAddress: string;
    title: string;
    description?: string | null;
    schema: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    isActive?: boolean;
    createdAt?: Date | string;
    submissions?: Prisma.SubmissionUncheckedCreateNestedManyWithoutFormInput;
};
export type FormUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    creatorAddress?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    schema?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    submissions?: Prisma.SubmissionUpdateManyWithoutFormNestedInput;
};
export type FormUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    creatorAddress?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    schema?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    submissions?: Prisma.SubmissionUncheckedUpdateManyWithoutFormNestedInput;
};
export type FormCreateManyInput = {
    id?: string;
    creatorAddress: string;
    title: string;
    description?: string | null;
    schema: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    isActive?: boolean;
    createdAt?: Date | string;
};
export type FormUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    creatorAddress?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    schema?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type FormUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    creatorAddress?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    schema?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type FormCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    creatorAddress?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    schema?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type FormMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    creatorAddress?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type FormMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    creatorAddress?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type FormScalarRelationFilter = {
    is?: Prisma.FormWhereInput;
    isNot?: Prisma.FormWhereInput;
};
export type StringFieldUpdateOperationsInput = {
    set?: string;
};
export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null;
};
export type BoolFieldUpdateOperationsInput = {
    set?: boolean;
};
export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string;
};
export type FormCreateNestedOneWithoutSubmissionsInput = {
    create?: Prisma.XOR<Prisma.FormCreateWithoutSubmissionsInput, Prisma.FormUncheckedCreateWithoutSubmissionsInput>;
    connectOrCreate?: Prisma.FormCreateOrConnectWithoutSubmissionsInput;
    connect?: Prisma.FormWhereUniqueInput;
};
export type FormUpdateOneRequiredWithoutSubmissionsNestedInput = {
    create?: Prisma.XOR<Prisma.FormCreateWithoutSubmissionsInput, Prisma.FormUncheckedCreateWithoutSubmissionsInput>;
    connectOrCreate?: Prisma.FormCreateOrConnectWithoutSubmissionsInput;
    upsert?: Prisma.FormUpsertWithoutSubmissionsInput;
    connect?: Prisma.FormWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.FormUpdateToOneWithWhereWithoutSubmissionsInput, Prisma.FormUpdateWithoutSubmissionsInput>, Prisma.FormUncheckedUpdateWithoutSubmissionsInput>;
};
export type FormCreateWithoutSubmissionsInput = {
    id?: string;
    creatorAddress: string;
    title: string;
    description?: string | null;
    schema: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    isActive?: boolean;
    createdAt?: Date | string;
};
export type FormUncheckedCreateWithoutSubmissionsInput = {
    id?: string;
    creatorAddress: string;
    title: string;
    description?: string | null;
    schema: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    isActive?: boolean;
    createdAt?: Date | string;
};
export type FormCreateOrConnectWithoutSubmissionsInput = {
    where: Prisma.FormWhereUniqueInput;
    create: Prisma.XOR<Prisma.FormCreateWithoutSubmissionsInput, Prisma.FormUncheckedCreateWithoutSubmissionsInput>;
};
export type FormUpsertWithoutSubmissionsInput = {
    update: Prisma.XOR<Prisma.FormUpdateWithoutSubmissionsInput, Prisma.FormUncheckedUpdateWithoutSubmissionsInput>;
    create: Prisma.XOR<Prisma.FormCreateWithoutSubmissionsInput, Prisma.FormUncheckedCreateWithoutSubmissionsInput>;
    where?: Prisma.FormWhereInput;
};
export type FormUpdateToOneWithWhereWithoutSubmissionsInput = {
    where?: Prisma.FormWhereInput;
    data: Prisma.XOR<Prisma.FormUpdateWithoutSubmissionsInput, Prisma.FormUncheckedUpdateWithoutSubmissionsInput>;
};
export type FormUpdateWithoutSubmissionsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    creatorAddress?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    schema?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type FormUncheckedUpdateWithoutSubmissionsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    creatorAddress?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    schema?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type FormCountOutputType = {
    submissions: number;
};
export type FormCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    submissions?: boolean | FormCountOutputTypeCountSubmissionsArgs;
};
export type FormCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FormCountOutputTypeSelect<ExtArgs> | null;
};
export type FormCountOutputTypeCountSubmissionsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SubmissionWhereInput;
};
export type FormSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    creatorAddress?: boolean;
    title?: boolean;
    description?: boolean;
    schema?: boolean;
    isActive?: boolean;
    createdAt?: boolean;
    submissions?: boolean | Prisma.Form$submissionsArgs<ExtArgs>;
    _count?: boolean | Prisma.FormCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["form"]>;
export type FormSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    creatorAddress?: boolean;
    title?: boolean;
    description?: boolean;
    schema?: boolean;
    isActive?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["form"]>;
export type FormSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    creatorAddress?: boolean;
    title?: boolean;
    description?: boolean;
    schema?: boolean;
    isActive?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["form"]>;
export type FormSelectScalar = {
    id?: boolean;
    creatorAddress?: boolean;
    title?: boolean;
    description?: boolean;
    schema?: boolean;
    isActive?: boolean;
    createdAt?: boolean;
};
export type FormOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "creatorAddress" | "title" | "description" | "schema" | "isActive" | "createdAt", ExtArgs["result"]["form"]>;
export type FormInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    submissions?: boolean | Prisma.Form$submissionsArgs<ExtArgs>;
    _count?: boolean | Prisma.FormCountOutputTypeDefaultArgs<ExtArgs>;
};
export type FormIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type FormIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type $FormPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Form";
    objects: {
        submissions: Prisma.$SubmissionPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        creatorAddress: string;
        title: string;
        description: string | null;
        schema: runtime.JsonValue;
        isActive: boolean;
        createdAt: Date;
    }, ExtArgs["result"]["form"]>;
    composites: {};
};
export type FormGetPayload<S extends boolean | null | undefined | FormDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$FormPayload, S>;
export type FormCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<FormFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: FormCountAggregateInputType | true;
};
export interface FormDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Form'];
        meta: {
            name: 'Form';
        };
    };
    findUnique<T extends FormFindUniqueArgs>(args: Prisma.SelectSubset<T, FormFindUniqueArgs<ExtArgs>>): Prisma.Prisma__FormClient<runtime.Types.Result.GetResult<Prisma.$FormPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends FormFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, FormFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__FormClient<runtime.Types.Result.GetResult<Prisma.$FormPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends FormFindFirstArgs>(args?: Prisma.SelectSubset<T, FormFindFirstArgs<ExtArgs>>): Prisma.Prisma__FormClient<runtime.Types.Result.GetResult<Prisma.$FormPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends FormFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, FormFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__FormClient<runtime.Types.Result.GetResult<Prisma.$FormPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends FormFindManyArgs>(args?: Prisma.SelectSubset<T, FormFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$FormPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends FormCreateArgs>(args: Prisma.SelectSubset<T, FormCreateArgs<ExtArgs>>): Prisma.Prisma__FormClient<runtime.Types.Result.GetResult<Prisma.$FormPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends FormCreateManyArgs>(args?: Prisma.SelectSubset<T, FormCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends FormCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, FormCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$FormPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends FormDeleteArgs>(args: Prisma.SelectSubset<T, FormDeleteArgs<ExtArgs>>): Prisma.Prisma__FormClient<runtime.Types.Result.GetResult<Prisma.$FormPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends FormUpdateArgs>(args: Prisma.SelectSubset<T, FormUpdateArgs<ExtArgs>>): Prisma.Prisma__FormClient<runtime.Types.Result.GetResult<Prisma.$FormPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends FormDeleteManyArgs>(args?: Prisma.SelectSubset<T, FormDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends FormUpdateManyArgs>(args: Prisma.SelectSubset<T, FormUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends FormUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, FormUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$FormPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends FormUpsertArgs>(args: Prisma.SelectSubset<T, FormUpsertArgs<ExtArgs>>): Prisma.Prisma__FormClient<runtime.Types.Result.GetResult<Prisma.$FormPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends FormCountArgs>(args?: Prisma.Subset<T, FormCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], FormCountAggregateOutputType> : number>;
    aggregate<T extends FormAggregateArgs>(args: Prisma.Subset<T, FormAggregateArgs>): Prisma.PrismaPromise<GetFormAggregateType<T>>;
    groupBy<T extends FormGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: FormGroupByArgs['orderBy'];
    } : {
        orderBy?: FormGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, FormGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFormGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: FormFieldRefs;
}
export interface Prisma__FormClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    submissions<T extends Prisma.Form$submissionsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Form$submissionsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SubmissionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface FormFieldRefs {
    readonly id: Prisma.FieldRef<"Form", 'String'>;
    readonly creatorAddress: Prisma.FieldRef<"Form", 'String'>;
    readonly title: Prisma.FieldRef<"Form", 'String'>;
    readonly description: Prisma.FieldRef<"Form", 'String'>;
    readonly schema: Prisma.FieldRef<"Form", 'Json'>;
    readonly isActive: Prisma.FieldRef<"Form", 'Boolean'>;
    readonly createdAt: Prisma.FieldRef<"Form", 'DateTime'>;
}
export type FormFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FormSelect<ExtArgs> | null;
    omit?: Prisma.FormOmit<ExtArgs> | null;
    include?: Prisma.FormInclude<ExtArgs> | null;
    where: Prisma.FormWhereUniqueInput;
};
export type FormFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FormSelect<ExtArgs> | null;
    omit?: Prisma.FormOmit<ExtArgs> | null;
    include?: Prisma.FormInclude<ExtArgs> | null;
    where: Prisma.FormWhereUniqueInput;
};
export type FormFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FormSelect<ExtArgs> | null;
    omit?: Prisma.FormOmit<ExtArgs> | null;
    include?: Prisma.FormInclude<ExtArgs> | null;
    where?: Prisma.FormWhereInput;
    orderBy?: Prisma.FormOrderByWithRelationInput | Prisma.FormOrderByWithRelationInput[];
    cursor?: Prisma.FormWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.FormScalarFieldEnum | Prisma.FormScalarFieldEnum[];
};
export type FormFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FormSelect<ExtArgs> | null;
    omit?: Prisma.FormOmit<ExtArgs> | null;
    include?: Prisma.FormInclude<ExtArgs> | null;
    where?: Prisma.FormWhereInput;
    orderBy?: Prisma.FormOrderByWithRelationInput | Prisma.FormOrderByWithRelationInput[];
    cursor?: Prisma.FormWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.FormScalarFieldEnum | Prisma.FormScalarFieldEnum[];
};
export type FormFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FormSelect<ExtArgs> | null;
    omit?: Prisma.FormOmit<ExtArgs> | null;
    include?: Prisma.FormInclude<ExtArgs> | null;
    where?: Prisma.FormWhereInput;
    orderBy?: Prisma.FormOrderByWithRelationInput | Prisma.FormOrderByWithRelationInput[];
    cursor?: Prisma.FormWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.FormScalarFieldEnum | Prisma.FormScalarFieldEnum[];
};
export type FormCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FormSelect<ExtArgs> | null;
    omit?: Prisma.FormOmit<ExtArgs> | null;
    include?: Prisma.FormInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.FormCreateInput, Prisma.FormUncheckedCreateInput>;
};
export type FormCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.FormCreateManyInput | Prisma.FormCreateManyInput[];
    skipDuplicates?: boolean;
};
export type FormCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FormSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.FormOmit<ExtArgs> | null;
    data: Prisma.FormCreateManyInput | Prisma.FormCreateManyInput[];
    skipDuplicates?: boolean;
};
export type FormUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FormSelect<ExtArgs> | null;
    omit?: Prisma.FormOmit<ExtArgs> | null;
    include?: Prisma.FormInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.FormUpdateInput, Prisma.FormUncheckedUpdateInput>;
    where: Prisma.FormWhereUniqueInput;
};
export type FormUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.FormUpdateManyMutationInput, Prisma.FormUncheckedUpdateManyInput>;
    where?: Prisma.FormWhereInput;
    limit?: number;
};
export type FormUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FormSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.FormOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.FormUpdateManyMutationInput, Prisma.FormUncheckedUpdateManyInput>;
    where?: Prisma.FormWhereInput;
    limit?: number;
};
export type FormUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FormSelect<ExtArgs> | null;
    omit?: Prisma.FormOmit<ExtArgs> | null;
    include?: Prisma.FormInclude<ExtArgs> | null;
    where: Prisma.FormWhereUniqueInput;
    create: Prisma.XOR<Prisma.FormCreateInput, Prisma.FormUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.FormUpdateInput, Prisma.FormUncheckedUpdateInput>;
};
export type FormDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FormSelect<ExtArgs> | null;
    omit?: Prisma.FormOmit<ExtArgs> | null;
    include?: Prisma.FormInclude<ExtArgs> | null;
    where: Prisma.FormWhereUniqueInput;
};
export type FormDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.FormWhereInput;
    limit?: number;
};
export type Form$submissionsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type FormDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FormSelect<ExtArgs> | null;
    omit?: Prisma.FormOmit<ExtArgs> | null;
    include?: Prisma.FormInclude<ExtArgs> | null;
};
export {};
