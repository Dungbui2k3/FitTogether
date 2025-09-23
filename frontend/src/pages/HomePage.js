import {
  Box,
  Container,
  Text,
  Button,
  Stack,
  Flex,
  Grid,
  GridItem,
  Image,
  Badge,
  Card,
  CardBody,
  Heading,
  SimpleGrid,
} from "@chakra-ui/react"
import { Link as RouterLink } from "react-router-dom"

const HomePage = () => {
  const featuredProducts = [
    {
      id: 1,
      name: "Vợt Cầu Lông Pro X1",
      price: "2,500,000",
      originalPrice: "3,000,000",
      image: "/badminton-racket-professional.jpg",
      badge: "Bán chạy",
      category: "Cầu lông",
    },
    {
      id: 2,
      name: "Vợt Pickleball Elite",
      price: "1,800,000",
      originalPrice: "2,200,000",
      image: "/pickleball-paddle-elite.jpg",
      badge: "Giảm giá",
      category: "Pickleball",
    },
    {
      id: 3,
      name: "Giày Cầu Lông Speed",
      price: "1,200,000",
      image: "/badminton-shoes-athletic.jpg",
      badge: "Mới",
      category: "Giày",
    },
    {
      id: 4,
      name: "Bộ Phụ Kiện Complete",
      price: "800,000",
      image: "/sports-accessories-set.jpg",
      badge: "Combo",
      category: "Phụ kiện",
    },
  ]

  return (
    <Box>
      {/* Hero Section */}
      <Box bgGradient="linear(to-r, brand.600, brand.800)" color="white" py={20} position="relative" overflow="hidden">
        <Container maxW="6xl">
          <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={8} alignItems="center">
            <GridItem>
              <Stack spacing={6}>
                <Badge colorScheme="yellow" w="fit-content" px={3} py={1}>
                  🏆 CHẤT LƯỢNG HÀNG ĐẦU
                </Badge>
                <Heading fontSize={{ base: "3xl", md: "5xl", lg: "6xl" }} fontWeight="black" lineHeight="shorter">
                  FIT TOGETHER
                </Heading>
                <Text fontSize={{ base: "lg", md: "xl" }} color="brand.100">
                  Cửa hàng thể thao chuyên nghiệp - Đồ cầu lông & Pickleball chất lượng cao
                </Text>
                <Text fontSize="md" color="brand.200">
                  Khám phá bộ sưu tập vợt, giày và phụ kiện thể thao từ các thương hiệu hàng đầu thế giới
                </Text>
                <Stack direction={{ base: "column", sm: "row" }} spacing={4}>
                  <Button as={RouterLink} to="/products" size="lg" colorScheme="yellow" color="gray.800" px={8}>
                    Mua sắm ngay
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    borderColor="white"
                    color="white"
                    _hover={{ bg: "whiteAlpha.200" }}
                  >
                    Xem catalog
                  </Button>
                </Stack>
              </Stack>
            </GridItem>
            <GridItem display={{ base: "none", lg: "block" }}>
              <Image src="/sports-equipment-badminton-pickleball-hero.jpg" alt="Sports Equipment" borderRadius="xl" shadow="2xl" />
            </GridItem>
          </Grid>
        </Container>
      </Box>

      {/* Categories Section */}
      <Container maxW="6xl" py={16}>
        <Stack spacing={12}>
          <Box textAlign="center">
            <Heading fontSize="3xl" mb={4}>
              DANH MỤC SẢN PHẨM
            </Heading>
            <Text fontSize="lg" color="gray.600">
              Khám phá các sản phẩm thể thao chất lượng cao
            </Text>
          </Box>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
            {[
              {
                title: "Vợt Cầu Lông",
                desc: "50+ sản phẩm",
                image: "/badminton-rackets-collection.jpg",
                color: "brand",
              },
              {
                title: "Vợt Pickleball",
                desc: "30+ sản phẩm",
                image: "/pickleball-paddles-collection.jpg",
                color: "accent",
              },
              {
                title: "Giày Thể Thao",
                desc: "40+ sản phẩm",
                image: "/athletic-sports-shoes.jpg",
                color: "green",
              },
              {
                title: "Phụ Kiện",
                desc: "100+ sản phẩm",
                image: "/sports-accessories-gear.jpg",
                color: "purple",
              },
            ].map((category, index) => (
              <Card
                key={index}
                cursor="pointer"
                transition="all 0.3s"
                _hover={{ transform: "translateY(-5px)", shadow: "xl" }}
              >
                <CardBody p={0}>
                  <Image
                    src={category.image || "/placeholder.svg"}
                    alt={category.title}
                    borderTopRadius="md"
                    h="200px"
                    w="100%"
                    objectFit="cover"
                  />
                  <Box p={6}>
                    <Heading size="md" mb={2}>
                      {category.title}
                    </Heading>
                    <Text color="gray.600">{category.desc}</Text>
                  </Box>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        </Stack>
      </Container>

      {/* Featured Products */}
      <Box bg="gray.100" py={16}>
        <Container maxW="6xl">
          <Stack spacing={12}>
            <Flex justify="space-between" align="center">
              <Box>
                <Heading fontSize="3xl" mb={2}>
                  SẢN PHẨM NỔI BẬT
                </Heading>
                <Text color="gray.600">Những sản phẩm được yêu thích nhất</Text>
              </Box>
              <Button as={RouterLink} to="/products" variant="outline" colorScheme="brand">
                Xem tất cả
              </Button>
            </Flex>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
              {featuredProducts.map((product) => (
                <Card
                  key={product.id}
                  bg="white"
                  cursor="pointer"
                  transition="all 0.3s"
                  _hover={{ transform: "translateY(-5px)", shadow: "xl" }}
                >
                  <CardBody p={0}>
                    <Box position="relative">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        borderTopRadius="md"
                        h="250px"
                        w="100%"
                        objectFit="cover"
                      />
                      <Badge
                        position="absolute"
                        top={3}
                        left={3}
                        colorScheme={
                          product.badge === "Bán chạy"
                            ? "red"
                            : product.badge === "Giảm giá"
                              ? "green"
                              : product.badge === "Mới"
                                ? "blue"
                                : "purple"
                        }
                      >
                        {product.badge}
                      </Badge>
                    </Box>
                    <Box p={4}>
                      <Text fontSize="sm" color="gray.500" mb={1}>
                        {product.category}
                      </Text>
                      <Heading size="sm" mb={2} noOfLines={2}>
                        {product.name}
                      </Heading>
                      <Flex align="center" justify="space-between">
                        <Stack spacing={0}>
                          <Text fontWeight="bold" color="brand.600" fontSize="lg">
                            {product.price}đ
                          </Text>
                          {product.originalPrice && (
                            <Text fontSize="sm" color="gray.500" textDecoration="line-through">
                              {product.originalPrice}đ
                            </Text>
                          )}
                        </Stack>
                        <Button size="sm" colorScheme="brand">
                          Thêm vào giỏ
                        </Button>
                      </Flex>
                    </Box>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          </Stack>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box bg="brand.600" color="white" py={16}>
        <Container maxW="4xl" textAlign="center">
          <Stack spacing={6}>
            <Heading fontSize="3xl">Tham gia cộng đồng Fit Together</Heading>
            <Text fontSize="lg" color="brand.100">
              Nhận thông tin về sản phẩm mới, khuyến mãi đặc biệt và tips thể thao
            </Text>
            <Stack direction={{ base: "column", sm: "row" }} spacing={4} justify="center">
              <Button as={RouterLink} to="/register" size="lg" colorScheme="yellow" color="gray.800">
                Đăng ký ngay
              </Button>
              <Button size="lg" variant="outline" borderColor="white" color="white" _hover={{ bg: "whiteAlpha.200" }}>
                Tìm hiểu thêm
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </Box>
  )
}

export default HomePage
