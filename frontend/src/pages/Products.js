"use client"

import { useState } from "react"
import {
  Box,
  Container,
  Card,
  CardBody,
  Image,
  Text,
  Button,
  Stack,
  Badge,
  Heading,
  Select,
  Input,
  Flex,
  SimpleGrid,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react"
import { SearchIcon } from "@chakra-ui/icons"

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  const products = [
    {
      id: 1,
      name: "Vợt Cầu Lông Yonex Arcsaber 11",
      price: "3,200,000",
      originalPrice: "3,800,000",
      image: "/yonex-badminton-racket-professional.jpg",
      badge: "Bán chạy",
      category: "badminton",
      rating: 4.8,
    },
    {
      id: 2,
      name: "Vợt Pickleball Selkirk Amped",
      price: "2,100,000",
      originalPrice: "2,500,000",
      image: "/selkirk-pickleball-paddle.jpg",
      badge: "Giảm giá",
      category: "pickleball",
      rating: 4.7,
    },
    {
      id: 3,
      name: "Giày Cầu Lông Victor SH-A922",
      price: "1,800,000",
      image: "/victor-badminton-shoes.jpg",
      badge: "Mới",
      category: "shoes",
      rating: 4.6,
    },
    {
      id: 4,
      name: "Vợt Cầu Lông Victor Thruster K9900",
      price: "2,800,000",
      image: "/victor-thruster-badminton-racket.jpg",
      category: "badminton",
      rating: 4.9,
    },
    {
      id: 5,
      name: "Vợt Pickleball Paddletek Tempest",
      price: "1,900,000",
      image: "/paddletek-tempest-pickleball.jpg",
      category: "pickleball",
      rating: 4.5,
    },
    {
      id: 6,
      name: "Giày Pickleball K-Swiss Express",
      price: "1,600,000",
      image: "/k-swiss-pickleball-shoes.jpg",
      category: "shoes",
      rating: 4.4,
    },
    {
      id: 7,
      name: "Túi Vợt Yonex Pro Series",
      price: "800,000",
      image: "/placeholder.svg?height=300&width=300",
      category: "accessories",
      rating: 4.3,
    },
    {
      id: 8,
      name: "Quấn Cán Vợt Tourna Grip",
      price: "150,000",
      image: "/placeholder.svg?height=300&width=300",
      badge: "Phụ kiện",
      category: "accessories",
      rating: 4.7,
    },
  ]

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <Container maxW="6xl" py={8}>
      <Stack spacing={8}>
        {/* Header */}
        <Box>
          <Heading fontSize="3xl" mb={2}>
            Sản phẩm
          </Heading>
          <Text color="gray.600">Khám phá bộ sưu tập đồ thể thao chất lượng cao</Text>
        </Box>

        {/* Filters */}
        <Flex direction={{ base: "column", md: "row" }} gap={4} align={{ base: "stretch", md: "center" }}>
          <InputGroup maxW={{ base: "full", md: "300px" }}>
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.300" />
            </InputLeftElement>
            <Input
              placeholder="Tìm kiếm sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>

          <Select
            maxW={{ base: "full", md: "200px" }}
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">Tất cả danh mục</option>
            <option value="badminton">Cầu lông</option>
            <option value="pickleball">Pickleball</option>
            <option value="shoes">Giày</option>
            <option value="accessories">Phụ kiện</option>
          </Select>

          <Text color="gray.600" fontSize="sm" whiteSpace="nowrap">
            {filteredProducts.length} sản phẩm
          </Text>
        </Flex>

        {/* Products Grid */}
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
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
                  {product.badge && (
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
                  )}
                </Box>
                <Box p={4}>
                  <Heading size="sm" mb={2} noOfLines={2}>
                    {product.name}
                  </Heading>
                  <Text fontSize="sm" color="gray.500" mb={2}>
                    ⭐ {product.rating} (128 đánh giá)
                  </Text>
                  <Stack spacing={2}>
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
                    </Flex>
                    <Button colorScheme="brand" size="sm" w="full">
                      Thêm vào giỏ
                    </Button>
                  </Stack>
                </Box>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>

        {filteredProducts.length === 0 && (
          <Box textAlign="center" py={12}>
            <Text fontSize="lg" color="gray.500">
              Không tìm thấy sản phẩm nào phù hợp
            </Text>
          </Box>
        )}
      </Stack>
    </Container>
  )
}

export default Products
