import { ActionIcon, Anchor, Center, Container, Group, rem, Stack, Text } from "@mantine/core";
import { IconBrandGithub } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

const CURRENT_YEAR = new Date().getFullYear();

export const Footer = () => {
	const { t } = useTranslation();

	return (
		<Center>
			<Group my={8} maw="20rem">
				<Stack gap="0.25rem">
					<Text size="xs" c="dimmed">
						{t("dataFrom")}{" "}
						<Anchor href="https://easywk.de" target="_blank">
							EasyWK
						</Anchor>
					</Text>
					<Text c="dimmed" size="sm">
						© {CURRENT_YEAR} Lukas Nielsen
					</Text>
				</Stack>
				<Container>
					<ActionIcon component="a" href="https://github.com/Lukas-Nielsen" target="_blank" size="lg" color="gray" variant="subtle">
						<IconBrandGithub style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
					</ActionIcon>
				</Container>
			</Group>
		</Center>
	);
};
