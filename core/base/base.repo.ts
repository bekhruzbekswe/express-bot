import { supabase } from "../supabase.ts";
import { PaginatedResult } from "./base.types.ts";

export class BaseRepo<T> {
  constructor(protected readonly table: string) {}

  async create(
    record: Omit<T, "id" | "created_at" | "updated_at" | "deleted_at">,
  ): Promise<T> {
    const { data, error } = await supabase
      .from(this.table)
      .insert({ ...record })
      .select()
      .single();

    if (error) throw error;
    return data as T;
  }

  async getOne(id: number): Promise<T | null> {
    const { data, error } = await supabase
      .from(this.table)
      .select("*")
      .eq("id", id)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return data as T | null;
  }

  async getMany(
    userId: number,
    page = 1,
    perPage = 5,
  ): Promise<PaginatedResult<T>> {
    const from = (page - 1) * perPage;
    const to = from + perPage - 1;

    const { data, count, error } = await supabase
      .from(this.table)
      .select("*", { count: "exact" })
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) throw error;

    return {
      data: (data ?? []) as T[],
      total: count ?? 0,
      page,
      perPage,
    };
  }

  async getAll(
    page = 1,
    perPage = 5,
  ): Promise<PaginatedResult<T>> {
    const from = (page - 1) * perPage;
    const to = from + perPage - 1;

    const { data, count, error } = await supabase
      .from(this.table)
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) throw error;

    return {
      data: (data ?? []) as T[],
      total: count ?? 0,
      page,
      perPage,
    };
  }

  async update(id: number, fields: Partial<T>): Promise<T> {
    const { data, error } = await supabase
      .from(this.table)
      .update(fields)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as T;
  }

  async delete(id: number): Promise<void> {
    const { error } = await supabase
      .from(this.table)
      .delete()
      .eq("id", id);

    if (error) throw error;
  }
}
