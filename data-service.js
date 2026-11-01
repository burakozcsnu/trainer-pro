(function () {
    'use strict';

    window.TrainerProDataService = {
        create(client) {
            if (!client) throw new Error('Supabase client is required.');

            return {
                async fetchAll(table, pageSize = 1000) {
                    const rows = [];
                    let from = 0;
                    while (true) {
                        const { data, error } = await client
                            .from(table)
                            .select('*')
                            .range(from, from + pageSize - 1);
                        if (error) throw error;
                        if (!data?.length) break;
                        rows.push(...data);
                        from += pageSize;
                        if (data.length < pageSize) break;
                    }
                    return rows;
                },

                async select(table, columns = '*', options = {}) {
                    let query = client.from(table).select(columns);
                    if (options.order) {
                        query = query.order(options.order.column, {
                            ascending: options.order.ascending ?? true
                        });
                    }
                    if (options.limit) query = query.limit(options.limit);
                    const { data, error } = await query;
                    if (error) throw error;
                    return data || [];
                }
            };
        }
    };
})();
