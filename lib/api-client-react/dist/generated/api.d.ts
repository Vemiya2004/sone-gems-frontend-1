import type { QueryKey, UseMutationOptions, UseMutationResult, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import type { AnalyticsData, AuthResponse, Banner, BannerInput, BannerUpdate, DashboardStats, Gem, GemCategory, GemInput, GemListResponse, GemSalesSummary, GemUpdate, GetAnalyticsParams, GetRevenueParams, GetTopSellingGemsParams, GoogleAuthInput, HealthStatus, ListGemsParams, ListOrdersParams, LoginInput, Offer, OfferInput, OfferUpdate, Order, OrderInput, OrderUpdate, PayhereNotification, PaymentInitInput, PaymentInitResponse, RevenueStats, SignupInput, Staff, StaffInput, StaffUpdate, UploadResponse, User, UserUpdate } from './api.schemas';
import { customFetch } from '../custom-fetch';
import type { ErrorType, BodyType } from '../custom-fetch';
type AwaitedInput<T> = PromiseLike<T> | T;
type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;
type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];
export declare const getHealthCheckUrl: () => string;
/**
 * @summary Health check
 */
export declare const healthCheck: (options?: RequestInit) => Promise<HealthStatus>;
export declare const getHealthCheckQueryKey: () => readonly ["/api/healthz"];
export declare const getHealthCheckQueryOptions: <TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData> & {
    queryKey: QueryKey;
};
export type HealthCheckQueryResult = NonNullable<Awaited<ReturnType<typeof healthCheck>>>;
export type HealthCheckQueryError = ErrorType<unknown>;
/**
 * @summary Health check
 */
export declare function useHealthCheck<TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getSignupUrl: () => string;
/**
 * @summary Register a new user
 */
export declare const signup: (signupInput: SignupInput, options?: RequestInit) => Promise<AuthResponse>;
export declare const getSignupMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof signup>>, TError, {
        data: BodyType<SignupInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof signup>>, TError, {
    data: BodyType<SignupInput>;
}, TContext>;
export type SignupMutationResult = NonNullable<Awaited<ReturnType<typeof signup>>>;
export type SignupMutationBody = BodyType<SignupInput>;
export type SignupMutationError = ErrorType<void>;
/**
* @summary Register a new user
*/
export declare const useSignup: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof signup>>, TError, {
        data: BodyType<SignupInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof signup>>, TError, {
    data: BodyType<SignupInput>;
}, TContext>;
export declare const getLoginUrl: () => string;
/**
 * @summary Login with username/email and password
 */
export declare const login: (loginInput: LoginInput, options?: RequestInit) => Promise<AuthResponse>;
export declare const getLoginMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof login>>, TError, {
        data: BodyType<LoginInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof login>>, TError, {
    data: BodyType<LoginInput>;
}, TContext>;
export type LoginMutationResult = NonNullable<Awaited<ReturnType<typeof login>>>;
export type LoginMutationBody = BodyType<LoginInput>;
export type LoginMutationError = ErrorType<void>;
/**
* @summary Login with username/email and password
*/
export declare const useLogin: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof login>>, TError, {
        data: BodyType<LoginInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof login>>, TError, {
    data: BodyType<LoginInput>;
}, TContext>;
export declare const getGoogleAuthUrl: () => string;
/**
 * @summary Login or register with Google OAuth
 */
export declare const googleAuth: (googleAuthInput: GoogleAuthInput, options?: RequestInit) => Promise<AuthResponse>;
export declare const getGoogleAuthMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof googleAuth>>, TError, {
        data: BodyType<GoogleAuthInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof googleAuth>>, TError, {
    data: BodyType<GoogleAuthInput>;
}, TContext>;
export type GoogleAuthMutationResult = NonNullable<Awaited<ReturnType<typeof googleAuth>>>;
export type GoogleAuthMutationBody = BodyType<GoogleAuthInput>;
export type GoogleAuthMutationError = ErrorType<unknown>;
/**
* @summary Login or register with Google OAuth
*/
export declare const useGoogleAuth: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof googleAuth>>, TError, {
        data: BodyType<GoogleAuthInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof googleAuth>>, TError, {
    data: BodyType<GoogleAuthInput>;
}, TContext>;
export declare const getAdminLoginUrl: () => string;
/**
 * @summary Admin login
 */
export declare const adminLogin: (loginInput: LoginInput, options?: RequestInit) => Promise<AuthResponse>;
export declare const getAdminLoginMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof adminLogin>>, TError, {
        data: BodyType<LoginInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof adminLogin>>, TError, {
    data: BodyType<LoginInput>;
}, TContext>;
export type AdminLoginMutationResult = NonNullable<Awaited<ReturnType<typeof adminLogin>>>;
export type AdminLoginMutationBody = BodyType<LoginInput>;
export type AdminLoginMutationError = ErrorType<void>;
/**
* @summary Admin login
*/
export declare const useAdminLogin: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof adminLogin>>, TError, {
        data: BodyType<LoginInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof adminLogin>>, TError, {
    data: BodyType<LoginInput>;
}, TContext>;
export declare const getListGemsUrl: (params?: ListGemsParams) => string;
/**
 * @summary List all gems with optional filters
 */
export declare const listGems: (params?: ListGemsParams, options?: RequestInit) => Promise<GemListResponse>;
export declare const getListGemsQueryKey: (params?: ListGemsParams) => readonly ["/api/gems", ...ListGemsParams[]];
export declare const getListGemsQueryOptions: <TData = Awaited<ReturnType<typeof listGems>>, TError = ErrorType<unknown>>(params?: ListGemsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listGems>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listGems>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListGemsQueryResult = NonNullable<Awaited<ReturnType<typeof listGems>>>;
export type ListGemsQueryError = ErrorType<unknown>;
/**
 * @summary List all gems with optional filters
 */
export declare function useListGems<TData = Awaited<ReturnType<typeof listGems>>, TError = ErrorType<unknown>>(params?: ListGemsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listGems>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getCreateGemUrl: () => string;
/**
 * @summary Create a new gem (admin only)
 */
export declare const createGem: (gemInput: GemInput, options?: RequestInit) => Promise<Gem>;
export declare const getCreateGemMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createGem>>, TError, {
        data: BodyType<GemInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createGem>>, TError, {
    data: BodyType<GemInput>;
}, TContext>;
export type CreateGemMutationResult = NonNullable<Awaited<ReturnType<typeof createGem>>>;
export type CreateGemMutationBody = BodyType<GemInput>;
export type CreateGemMutationError = ErrorType<unknown>;
/**
* @summary Create a new gem (admin only)
*/
export declare const useCreateGem: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createGem>>, TError, {
        data: BodyType<GemInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createGem>>, TError, {
    data: BodyType<GemInput>;
}, TContext>;
export declare const getGetFeaturedGemsUrl: () => string;
/**
 * @summary Get featured gems for homepage
 */
export declare const getFeaturedGems: (options?: RequestInit) => Promise<Gem[]>;
export declare const getGetFeaturedGemsQueryKey: () => readonly ["/api/gems/featured"];
export declare const getGetFeaturedGemsQueryOptions: <TData = Awaited<ReturnType<typeof getFeaturedGems>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getFeaturedGems>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getFeaturedGems>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetFeaturedGemsQueryResult = NonNullable<Awaited<ReturnType<typeof getFeaturedGems>>>;
export type GetFeaturedGemsQueryError = ErrorType<unknown>;
/**
 * @summary Get featured gems for homepage
 */
export declare function useGetFeaturedGems<TData = Awaited<ReturnType<typeof getFeaturedGems>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getFeaturedGems>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetGemCategoriesUrl: () => string;
/**
 * @summary Get all gem categories with counts
 */
export declare const getGemCategories: (options?: RequestInit) => Promise<GemCategory[]>;
export declare const getGetGemCategoriesQueryKey: () => readonly ["/api/gems/categories"];
export declare const getGetGemCategoriesQueryOptions: <TData = Awaited<ReturnType<typeof getGemCategories>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getGemCategories>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getGemCategories>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetGemCategoriesQueryResult = NonNullable<Awaited<ReturnType<typeof getGemCategories>>>;
export type GetGemCategoriesQueryError = ErrorType<unknown>;
/**
 * @summary Get all gem categories with counts
 */
export declare function useGetGemCategories<TData = Awaited<ReturnType<typeof getGemCategories>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getGemCategories>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetTopSellingGemsUrl: (params?: GetTopSellingGemsParams) => string;
/**
 * @summary Get top selling gems
 */
export declare const getTopSellingGems: (params?: GetTopSellingGemsParams, options?: RequestInit) => Promise<GemSalesSummary[]>;
export declare const getGetTopSellingGemsQueryKey: (params?: GetTopSellingGemsParams) => readonly ["/api/gems/top-selling", ...GetTopSellingGemsParams[]];
export declare const getGetTopSellingGemsQueryOptions: <TData = Awaited<ReturnType<typeof getTopSellingGems>>, TError = ErrorType<unknown>>(params?: GetTopSellingGemsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getTopSellingGems>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getTopSellingGems>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetTopSellingGemsQueryResult = NonNullable<Awaited<ReturnType<typeof getTopSellingGems>>>;
export type GetTopSellingGemsQueryError = ErrorType<unknown>;
/**
 * @summary Get top selling gems
 */
export declare function useGetTopSellingGems<TData = Awaited<ReturnType<typeof getTopSellingGems>>, TError = ErrorType<unknown>>(params?: GetTopSellingGemsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getTopSellingGems>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetGemUrl: (id: string) => string;
/**
 * @summary Get a single gem by ID
 */
export declare const getGem: (id: string, options?: RequestInit) => Promise<Gem>;
export declare const getGetGemQueryKey: (id: string) => readonly [`/api/gems/${string}`];
export declare const getGetGemQueryOptions: <TData = Awaited<ReturnType<typeof getGem>>, TError = ErrorType<void>>(id: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getGem>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getGem>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetGemQueryResult = NonNullable<Awaited<ReturnType<typeof getGem>>>;
export type GetGemQueryError = ErrorType<void>;
/**
 * @summary Get a single gem by ID
 */
export declare function useGetGem<TData = Awaited<ReturnType<typeof getGem>>, TError = ErrorType<void>>(id: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getGem>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getUpdateGemUrl: (id: string) => string;
/**
 * @summary Update a gem (admin only)
 */
export declare const updateGem: (id: string, gemUpdate: GemUpdate, options?: RequestInit) => Promise<Gem>;
export declare const getUpdateGemMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateGem>>, TError, {
        id: string;
        data: BodyType<GemUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateGem>>, TError, {
    id: string;
    data: BodyType<GemUpdate>;
}, TContext>;
export type UpdateGemMutationResult = NonNullable<Awaited<ReturnType<typeof updateGem>>>;
export type UpdateGemMutationBody = BodyType<GemUpdate>;
export type UpdateGemMutationError = ErrorType<unknown>;
/**
* @summary Update a gem (admin only)
*/
export declare const useUpdateGem: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateGem>>, TError, {
        id: string;
        data: BodyType<GemUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateGem>>, TError, {
    id: string;
    data: BodyType<GemUpdate>;
}, TContext>;
export declare const getDeleteGemUrl: (id: string) => string;
/**
 * @summary Delete a gem (admin only)
 */
export declare const deleteGem: (id: string, options?: RequestInit) => Promise<void>;
export declare const getDeleteGemMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteGem>>, TError, {
        id: string;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteGem>>, TError, {
    id: string;
}, TContext>;
export type DeleteGemMutationResult = NonNullable<Awaited<ReturnType<typeof deleteGem>>>;
export type DeleteGemMutationError = ErrorType<unknown>;
/**
* @summary Delete a gem (admin only)
*/
export declare const useDeleteGem: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteGem>>, TError, {
        id: string;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteGem>>, TError, {
    id: string;
}, TContext>;
export declare const getGetRelatedGemsUrl: (id: string) => string;
/**
 * @summary Get related gems for "You may also like"
 */
export declare const getRelatedGems: (id: string, options?: RequestInit) => Promise<Gem[]>;
export declare const getGetRelatedGemsQueryKey: (id: string) => readonly [`/api/gems/${string}/related`];
export declare const getGetRelatedGemsQueryOptions: <TData = Awaited<ReturnType<typeof getRelatedGems>>, TError = ErrorType<unknown>>(id: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getRelatedGems>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getRelatedGems>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetRelatedGemsQueryResult = NonNullable<Awaited<ReturnType<typeof getRelatedGems>>>;
export type GetRelatedGemsQueryError = ErrorType<unknown>;
/**
 * @summary Get related gems for "You may also like"
 */
export declare function useGetRelatedGems<TData = Awaited<ReturnType<typeof getRelatedGems>>, TError = ErrorType<unknown>>(id: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getRelatedGems>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getListOrdersUrl: (params?: ListOrdersParams) => string;
/**
 * @summary List orders (admin gets all, user gets their own)
 */
export declare const listOrders: (params?: ListOrdersParams, options?: RequestInit) => Promise<Order[]>;
export declare const getListOrdersQueryKey: (params?: ListOrdersParams) => readonly ["/api/orders", ...ListOrdersParams[]];
export declare const getListOrdersQueryOptions: <TData = Awaited<ReturnType<typeof listOrders>>, TError = ErrorType<unknown>>(params?: ListOrdersParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listOrders>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listOrders>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListOrdersQueryResult = NonNullable<Awaited<ReturnType<typeof listOrders>>>;
export type ListOrdersQueryError = ErrorType<unknown>;
/**
 * @summary List orders (admin gets all, user gets their own)
 */
export declare function useListOrders<TData = Awaited<ReturnType<typeof listOrders>>, TError = ErrorType<unknown>>(params?: ListOrdersParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listOrders>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getCreateOrderUrl: () => string;
/**
 * @summary Create a new order
 */
export declare const createOrder: (orderInput: OrderInput, options?: RequestInit) => Promise<Order>;
export declare const getCreateOrderMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createOrder>>, TError, {
        data: BodyType<OrderInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createOrder>>, TError, {
    data: BodyType<OrderInput>;
}, TContext>;
export type CreateOrderMutationResult = NonNullable<Awaited<ReturnType<typeof createOrder>>>;
export type CreateOrderMutationBody = BodyType<OrderInput>;
export type CreateOrderMutationError = ErrorType<unknown>;
/**
* @summary Create a new order
*/
export declare const useCreateOrder: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createOrder>>, TError, {
        data: BodyType<OrderInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createOrder>>, TError, {
    data: BodyType<OrderInput>;
}, TContext>;
export declare const getGetOrderUrl: (id: string) => string;
/**
 * @summary Get order by ID
 */
export declare const getOrder: (id: string, options?: RequestInit) => Promise<Order>;
export declare const getGetOrderQueryKey: (id: string) => readonly [`/api/orders/${string}`];
export declare const getGetOrderQueryOptions: <TData = Awaited<ReturnType<typeof getOrder>>, TError = ErrorType<void>>(id: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getOrder>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getOrder>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetOrderQueryResult = NonNullable<Awaited<ReturnType<typeof getOrder>>>;
export type GetOrderQueryError = ErrorType<void>;
/**
 * @summary Get order by ID
 */
export declare function useGetOrder<TData = Awaited<ReturnType<typeof getOrder>>, TError = ErrorType<void>>(id: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getOrder>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getUpdateOrderUrl: (id: string) => string;
/**
 * @summary Update order status (admin only)
 */
export declare const updateOrder: (id: string, orderUpdate: OrderUpdate, options?: RequestInit) => Promise<Order>;
export declare const getUpdateOrderMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateOrder>>, TError, {
        id: string;
        data: BodyType<OrderUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateOrder>>, TError, {
    id: string;
    data: BodyType<OrderUpdate>;
}, TContext>;
export type UpdateOrderMutationResult = NonNullable<Awaited<ReturnType<typeof updateOrder>>>;
export type UpdateOrderMutationBody = BodyType<OrderUpdate>;
export type UpdateOrderMutationError = ErrorType<unknown>;
/**
* @summary Update order status (admin only)
*/
export declare const useUpdateOrder: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateOrder>>, TError, {
        id: string;
        data: BodyType<OrderUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateOrder>>, TError, {
    id: string;
    data: BodyType<OrderUpdate>;
}, TContext>;
export declare const getMarkOrderPaidUrl: (id: string) => string;
/**
 * @summary Mark order as paid (admin only)
 */
export declare const markOrderPaid: (id: string, options?: RequestInit) => Promise<Order>;
export declare const getMarkOrderPaidMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof markOrderPaid>>, TError, {
        id: string;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof markOrderPaid>>, TError, {
    id: string;
}, TContext>;
export type MarkOrderPaidMutationResult = NonNullable<Awaited<ReturnType<typeof markOrderPaid>>>;
export type MarkOrderPaidMutationError = ErrorType<unknown>;
/**
* @summary Mark order as paid (admin only)
*/
export declare const useMarkOrderPaid: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof markOrderPaid>>, TError, {
        id: string;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof markOrderPaid>>, TError, {
    id: string;
}, TContext>;
export declare const getGetUserUrl: (id: string) => string;
/**
 * @summary Get user profile
 */
export declare const getUser: (id: string, options?: RequestInit) => Promise<User>;
export declare const getGetUserQueryKey: (id: string) => readonly [`/api/users/${string}`];
export declare const getGetUserQueryOptions: <TData = Awaited<ReturnType<typeof getUser>>, TError = ErrorType<unknown>>(id: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getUser>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getUser>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetUserQueryResult = NonNullable<Awaited<ReturnType<typeof getUser>>>;
export type GetUserQueryError = ErrorType<unknown>;
/**
 * @summary Get user profile
 */
export declare function useGetUser<TData = Awaited<ReturnType<typeof getUser>>, TError = ErrorType<unknown>>(id: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getUser>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getUpdateUserUrl: (id: string) => string;
/**
 * @summary Update user profile
 */
export declare const updateUser: (id: string, userUpdate: UserUpdate, options?: RequestInit) => Promise<User>;
export declare const getUpdateUserMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateUser>>, TError, {
        id: string;
        data: BodyType<UserUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateUser>>, TError, {
    id: string;
    data: BodyType<UserUpdate>;
}, TContext>;
export type UpdateUserMutationResult = NonNullable<Awaited<ReturnType<typeof updateUser>>>;
export type UpdateUserMutationBody = BodyType<UserUpdate>;
export type UpdateUserMutationError = ErrorType<unknown>;
/**
* @summary Update user profile
*/
export declare const useUpdateUser: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateUser>>, TError, {
        id: string;
        data: BodyType<UserUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateUser>>, TError, {
    id: string;
    data: BodyType<UserUpdate>;
}, TContext>;
export declare const getGetUserOrdersUrl: (id: string) => string;
/**
 * @summary Get orders for a specific user
 */
export declare const getUserOrders: (id: string, options?: RequestInit) => Promise<Order[]>;
export declare const getGetUserOrdersQueryKey: (id: string) => readonly [`/api/users/${string}/orders`];
export declare const getGetUserOrdersQueryOptions: <TData = Awaited<ReturnType<typeof getUserOrders>>, TError = ErrorType<unknown>>(id: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getUserOrders>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getUserOrders>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetUserOrdersQueryResult = NonNullable<Awaited<ReturnType<typeof getUserOrders>>>;
export type GetUserOrdersQueryError = ErrorType<unknown>;
/**
 * @summary Get orders for a specific user
 */
export declare function useGetUserOrders<TData = Awaited<ReturnType<typeof getUserOrders>>, TError = ErrorType<unknown>>(id: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getUserOrders>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getListBannersUrl: () => string;
/**
 * @summary List all active banners
 */
export declare const listBanners: (options?: RequestInit) => Promise<Banner[]>;
export declare const getListBannersQueryKey: () => readonly ["/api/banners"];
export declare const getListBannersQueryOptions: <TData = Awaited<ReturnType<typeof listBanners>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listBanners>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listBanners>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListBannersQueryResult = NonNullable<Awaited<ReturnType<typeof listBanners>>>;
export type ListBannersQueryError = ErrorType<unknown>;
/**
 * @summary List all active banners
 */
export declare function useListBanners<TData = Awaited<ReturnType<typeof listBanners>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listBanners>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getCreateBannerUrl: () => string;
/**
 * @summary Create a banner (admin only)
 */
export declare const createBanner: (bannerInput: BannerInput, options?: RequestInit) => Promise<Banner>;
export declare const getCreateBannerMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createBanner>>, TError, {
        data: BodyType<BannerInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createBanner>>, TError, {
    data: BodyType<BannerInput>;
}, TContext>;
export type CreateBannerMutationResult = NonNullable<Awaited<ReturnType<typeof createBanner>>>;
export type CreateBannerMutationBody = BodyType<BannerInput>;
export type CreateBannerMutationError = ErrorType<unknown>;
/**
* @summary Create a banner (admin only)
*/
export declare const useCreateBanner: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createBanner>>, TError, {
        data: BodyType<BannerInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createBanner>>, TError, {
    data: BodyType<BannerInput>;
}, TContext>;
export declare const getUpdateBannerUrl: (id: string) => string;
/**
 * @summary Update banner
 */
export declare const updateBanner: (id: string, bannerUpdate: BannerUpdate, options?: RequestInit) => Promise<Banner>;
export declare const getUpdateBannerMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateBanner>>, TError, {
        id: string;
        data: BodyType<BannerUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateBanner>>, TError, {
    id: string;
    data: BodyType<BannerUpdate>;
}, TContext>;
export type UpdateBannerMutationResult = NonNullable<Awaited<ReturnType<typeof updateBanner>>>;
export type UpdateBannerMutationBody = BodyType<BannerUpdate>;
export type UpdateBannerMutationError = ErrorType<unknown>;
/**
* @summary Update banner
*/
export declare const useUpdateBanner: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateBanner>>, TError, {
        id: string;
        data: BodyType<BannerUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateBanner>>, TError, {
    id: string;
    data: BodyType<BannerUpdate>;
}, TContext>;
export declare const getDeleteBannerUrl: (id: string) => string;
/**
 * @summary Delete banner
 */
export declare const deleteBanner: (id: string, options?: RequestInit) => Promise<void>;
export declare const getDeleteBannerMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteBanner>>, TError, {
        id: string;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteBanner>>, TError, {
    id: string;
}, TContext>;
export type DeleteBannerMutationResult = NonNullable<Awaited<ReturnType<typeof deleteBanner>>>;
export type DeleteBannerMutationError = ErrorType<unknown>;
/**
* @summary Delete banner
*/
export declare const useDeleteBanner: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteBanner>>, TError, {
        id: string;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteBanner>>, TError, {
    id: string;
}, TContext>;
export declare const getListOffersUrl: () => string;
/**
 * @summary List all offers
 */
export declare const listOffers: (options?: RequestInit) => Promise<Offer[]>;
export declare const getListOffersQueryKey: () => readonly ["/api/offers"];
export declare const getListOffersQueryOptions: <TData = Awaited<ReturnType<typeof listOffers>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listOffers>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listOffers>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListOffersQueryResult = NonNullable<Awaited<ReturnType<typeof listOffers>>>;
export type ListOffersQueryError = ErrorType<unknown>;
/**
 * @summary List all offers
 */
export declare function useListOffers<TData = Awaited<ReturnType<typeof listOffers>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listOffers>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getCreateOfferUrl: () => string;
/**
 * @summary Create an offer (admin only)
 */
export declare const createOffer: (offerInput: OfferInput, options?: RequestInit) => Promise<Offer>;
export declare const getCreateOfferMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createOffer>>, TError, {
        data: BodyType<OfferInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createOffer>>, TError, {
    data: BodyType<OfferInput>;
}, TContext>;
export type CreateOfferMutationResult = NonNullable<Awaited<ReturnType<typeof createOffer>>>;
export type CreateOfferMutationBody = BodyType<OfferInput>;
export type CreateOfferMutationError = ErrorType<unknown>;
/**
* @summary Create an offer (admin only)
*/
export declare const useCreateOffer: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createOffer>>, TError, {
        data: BodyType<OfferInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createOffer>>, TError, {
    data: BodyType<OfferInput>;
}, TContext>;
export declare const getUpdateOfferUrl: (id: string) => string;
/**
 * @summary Update offer
 */
export declare const updateOffer: (id: string, offerUpdate: OfferUpdate, options?: RequestInit) => Promise<Offer>;
export declare const getUpdateOfferMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateOffer>>, TError, {
        id: string;
        data: BodyType<OfferUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateOffer>>, TError, {
    id: string;
    data: BodyType<OfferUpdate>;
}, TContext>;
export type UpdateOfferMutationResult = NonNullable<Awaited<ReturnType<typeof updateOffer>>>;
export type UpdateOfferMutationBody = BodyType<OfferUpdate>;
export type UpdateOfferMutationError = ErrorType<unknown>;
/**
* @summary Update offer
*/
export declare const useUpdateOffer: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateOffer>>, TError, {
        id: string;
        data: BodyType<OfferUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateOffer>>, TError, {
    id: string;
    data: BodyType<OfferUpdate>;
}, TContext>;
export declare const getDeleteOfferUrl: (id: string) => string;
/**
 * @summary Delete offer
 */
export declare const deleteOffer: (id: string, options?: RequestInit) => Promise<void>;
export declare const getDeleteOfferMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteOffer>>, TError, {
        id: string;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteOffer>>, TError, {
    id: string;
}, TContext>;
export type DeleteOfferMutationResult = NonNullable<Awaited<ReturnType<typeof deleteOffer>>>;
export type DeleteOfferMutationError = ErrorType<unknown>;
/**
* @summary Delete offer
*/
export declare const useDeleteOffer: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteOffer>>, TError, {
        id: string;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteOffer>>, TError, {
    id: string;
}, TContext>;
export declare const getListStaffUrl: () => string;
/**
 * @summary List all staff (admin only)
 */
export declare const listStaff: (options?: RequestInit) => Promise<Staff[]>;
export declare const getListStaffQueryKey: () => readonly ["/api/staff"];
export declare const getListStaffQueryOptions: <TData = Awaited<ReturnType<typeof listStaff>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listStaff>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listStaff>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListStaffQueryResult = NonNullable<Awaited<ReturnType<typeof listStaff>>>;
export type ListStaffQueryError = ErrorType<unknown>;
/**
 * @summary List all staff (admin only)
 */
export declare function useListStaff<TData = Awaited<ReturnType<typeof listStaff>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listStaff>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getCreateStaffUrl: () => string;
/**
 * @summary Create staff account (admin only)
 */
export declare const createStaff: (staffInput: StaffInput, options?: RequestInit) => Promise<Staff>;
export declare const getCreateStaffMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createStaff>>, TError, {
        data: BodyType<StaffInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createStaff>>, TError, {
    data: BodyType<StaffInput>;
}, TContext>;
export type CreateStaffMutationResult = NonNullable<Awaited<ReturnType<typeof createStaff>>>;
export type CreateStaffMutationBody = BodyType<StaffInput>;
export type CreateStaffMutationError = ErrorType<unknown>;
/**
* @summary Create staff account (admin only)
*/
export declare const useCreateStaff: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createStaff>>, TError, {
        data: BodyType<StaffInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createStaff>>, TError, {
    data: BodyType<StaffInput>;
}, TContext>;
export declare const getUpdateStaffUrl: (id: string) => string;
/**
 * @summary Update staff account
 */
export declare const updateStaff: (id: string, staffUpdate: StaffUpdate, options?: RequestInit) => Promise<Staff>;
export declare const getUpdateStaffMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateStaff>>, TError, {
        id: string;
        data: BodyType<StaffUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateStaff>>, TError, {
    id: string;
    data: BodyType<StaffUpdate>;
}, TContext>;
export type UpdateStaffMutationResult = NonNullable<Awaited<ReturnType<typeof updateStaff>>>;
export type UpdateStaffMutationBody = BodyType<StaffUpdate>;
export type UpdateStaffMutationError = ErrorType<unknown>;
/**
* @summary Update staff account
*/
export declare const useUpdateStaff: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateStaff>>, TError, {
        id: string;
        data: BodyType<StaffUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateStaff>>, TError, {
    id: string;
    data: BodyType<StaffUpdate>;
}, TContext>;
export declare const getDeleteStaffUrl: (id: string) => string;
/**
 * @summary Delete staff account
 */
export declare const deleteStaff: (id: string, options?: RequestInit) => Promise<void>;
export declare const getDeleteStaffMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteStaff>>, TError, {
        id: string;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteStaff>>, TError, {
    id: string;
}, TContext>;
export type DeleteStaffMutationResult = NonNullable<Awaited<ReturnType<typeof deleteStaff>>>;
export type DeleteStaffMutationError = ErrorType<unknown>;
/**
* @summary Delete staff account
*/
export declare const useDeleteStaff: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteStaff>>, TError, {
        id: string;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteStaff>>, TError, {
    id: string;
}, TContext>;
export declare const getGetRevenueUrl: (params?: GetRevenueParams) => string;
/**
 * @summary Get revenue stats with optional date filters
 */
export declare const getRevenue: (params?: GetRevenueParams, options?: RequestInit) => Promise<RevenueStats>;
export declare const getGetRevenueQueryKey: (params?: GetRevenueParams) => readonly ["/api/revenue", ...GetRevenueParams[]];
export declare const getGetRevenueQueryOptions: <TData = Awaited<ReturnType<typeof getRevenue>>, TError = ErrorType<unknown>>(params?: GetRevenueParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getRevenue>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getRevenue>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetRevenueQueryResult = NonNullable<Awaited<ReturnType<typeof getRevenue>>>;
export type GetRevenueQueryError = ErrorType<unknown>;
/**
 * @summary Get revenue stats with optional date filters
 */
export declare function useGetRevenue<TData = Awaited<ReturnType<typeof getRevenue>>, TError = ErrorType<unknown>>(params?: GetRevenueParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getRevenue>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetAnalyticsUrl: (params?: GetAnalyticsParams) => string;
/**
 * @summary Get analytics data
 */
export declare const getAnalytics: (params?: GetAnalyticsParams, options?: RequestInit) => Promise<AnalyticsData>;
export declare const getGetAnalyticsQueryKey: (params?: GetAnalyticsParams) => readonly ["/api/analytics", ...GetAnalyticsParams[]];
export declare const getGetAnalyticsQueryOptions: <TData = Awaited<ReturnType<typeof getAnalytics>>, TError = ErrorType<unknown>>(params?: GetAnalyticsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getAnalytics>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getAnalytics>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetAnalyticsQueryResult = NonNullable<Awaited<ReturnType<typeof getAnalytics>>>;
export type GetAnalyticsQueryError = ErrorType<unknown>;
/**
 * @summary Get analytics data
 */
export declare function useGetAnalytics<TData = Awaited<ReturnType<typeof getAnalytics>>, TError = ErrorType<unknown>>(params?: GetAnalyticsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getAnalytics>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetDashboardStatsUrl: () => string;
/**
 * @summary Get admin dashboard summary stats
 */
export declare const getDashboardStats: (options?: RequestInit) => Promise<DashboardStats>;
export declare const getGetDashboardStatsQueryKey: () => readonly ["/api/analytics/dashboard"];
export declare const getGetDashboardStatsQueryOptions: <TData = Awaited<ReturnType<typeof getDashboardStats>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getDashboardStats>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getDashboardStats>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetDashboardStatsQueryResult = NonNullable<Awaited<ReturnType<typeof getDashboardStats>>>;
export type GetDashboardStatsQueryError = ErrorType<unknown>;
/**
 * @summary Get admin dashboard summary stats
 */
export declare function useGetDashboardStats<TData = Awaited<ReturnType<typeof getDashboardStats>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getDashboardStats>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getPayhereNotifyUrl: () => string;
/**
 * @summary PayHere payment notification webhook
 */
export declare const payhereNotify: (payhereNotification: PayhereNotification, options?: RequestInit) => Promise<void>;
export declare const getPayhereNotifyMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof payhereNotify>>, TError, {
        data: BodyType<PayhereNotification>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof payhereNotify>>, TError, {
    data: BodyType<PayhereNotification>;
}, TContext>;
export type PayhereNotifyMutationResult = NonNullable<Awaited<ReturnType<typeof payhereNotify>>>;
export type PayhereNotifyMutationBody = BodyType<PayhereNotification>;
export type PayhereNotifyMutationError = ErrorType<unknown>;
/**
* @summary PayHere payment notification webhook
*/
export declare const usePayhereNotify: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof payhereNotify>>, TError, {
        data: BodyType<PayhereNotification>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof payhereNotify>>, TError, {
    data: BodyType<PayhereNotification>;
}, TContext>;
export declare const getInitiatePaymentUrl: () => string;
/**
 * @summary Initiate a PayHere payment
 */
export declare const initiatePayment: (paymentInitInput: PaymentInitInput, options?: RequestInit) => Promise<PaymentInitResponse>;
export declare const getInitiatePaymentMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof initiatePayment>>, TError, {
        data: BodyType<PaymentInitInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof initiatePayment>>, TError, {
    data: BodyType<PaymentInitInput>;
}, TContext>;
export type InitiatePaymentMutationResult = NonNullable<Awaited<ReturnType<typeof initiatePayment>>>;
export type InitiatePaymentMutationBody = BodyType<PaymentInitInput>;
export type InitiatePaymentMutationError = ErrorType<unknown>;
/**
* @summary Initiate a PayHere payment
*/
export declare const useInitiatePayment: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof initiatePayment>>, TError, {
        data: BodyType<PaymentInitInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof initiatePayment>>, TError, {
    data: BodyType<PaymentInitInput>;
}, TContext>;
export declare const getUploadImageUrl: () => string;
/**
 * @summary Upload image(s) for gem or banner
 */
export declare const uploadImage: (options?: RequestInit) => Promise<UploadResponse>;
export declare const getUploadImageMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof uploadImage>>, TError, void, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof uploadImage>>, TError, void, TContext>;
export type UploadImageMutationResult = NonNullable<Awaited<ReturnType<typeof uploadImage>>>;
export type UploadImageMutationError = ErrorType<unknown>;
/**
* @summary Upload image(s) for gem or banner
*/
export declare const useUploadImage: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof uploadImage>>, TError, void, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof uploadImage>>, TError, void, TContext>;
export {};
//# sourceMappingURL=api.d.ts.map