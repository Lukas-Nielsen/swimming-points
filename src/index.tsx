import {
	ActionIcon,
	Anchor,
	Center,
	Container,
	Group,
	MantineProvider,
	Text,
	rem,
} from "@mantine/core";
import "@mantine/core/styles.layer.css";
import { IconBrandGithub } from "@tabler/icons-react";
import { createRoot } from "react-dom/client";
import { Main } from "./Main";

const App = () => {
	return (
		<MantineProvider defaultColorScheme="auto">
			<Main />
			<Center>
				<Group my={8} maw="20rem">
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
			</Center>
		</MantineProvider>
	);
};

const element = document.querySelector("#root");
if (element) {
	const root = createRoot(element);
	root.render(<App />);
}
