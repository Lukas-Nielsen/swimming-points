import { createRoot } from "react-dom/client";
import {
	ActionIcon,
	Anchor,
	AppShell,
	Container,
	Group,
	MantineProvider,
	Text,
	rem,
} from "@mantine/core";
import { Main } from "./Main";

import "@mantine/core/styles.css";
import { IconBrandGithub } from "@tabler/icons-react";

const App = () => {
	return (
		<MantineProvider defaultColorScheme="auto">
			<AppShell withBorder={false} footer={{ height: rem(52) }}>
				<AppShell.Main>
					<Main />
				</AppShell.Main>
				<AppShell.Footer>
					<Group my={8}>
						<Container>
							<div>
								<Text size="xs" c="dimmed">
									Daten von{" "}
									<Anchor
										href="https://easywk.de"
										target="_blank"
									>
										EasyWK
									</Anchor>
								</Text>
								<Text c="dimmed" size="sm">
									© {new Date().getFullYear()} Lukas Nielsen
								</Text>
							</div>
						</Container>
						<Container>
							<ActionIcon
								component="a"
								href="https://github.com/Lukas-Nielsen"
								target="_blank"
								size="lg"
								color="gray"
								variant="subtle"
							>
								<IconBrandGithub
									style={{ width: rem(18), height: rem(18) }}
									stroke={1.5}
								/>
							</ActionIcon>
						</Container>
					</Group>
				</AppShell.Footer>
			</AppShell>
		</MantineProvider>
	);
};

const element = document.querySelector("#root");
if (element) {
	const root = createRoot(element);
	root.render(<App />);
}
