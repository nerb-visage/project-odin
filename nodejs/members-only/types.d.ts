declare global {
	declare module "hono" {
		interface ContextRenderer {
			(content: string | Promise<string>, props: { title: string }): Response;
		}
	}
}
