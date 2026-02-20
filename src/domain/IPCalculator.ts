export interface IPv4Result {
  ip: string;
  network: string;
  netmask: string;
  wildcard: string;
  broadcast: string;
  minHost: string;
  maxHost: string;
  numHosts: number;
  networkClass: string;
  networkType: string;
  ipBinary: string;
  networkBinary: string;
  netmaskBinary: string;
  wildcardBinary: string;
  broadcastBinary: string;
}

export interface IPv6Result {
  ipExpanded: string;
  network: string;
  lastAddress: string;
  numSubnets64: bigint;
  networkType: string;
}

// Nova interface para o Divisor de Redes
export interface SubnetSplit {
  network: string;
  range: string;
  broadcast: string;
  hosts: number;
}

export class IPCalculator {
  // ==========================================
  // CÁLCULOS IPv4
  // ==========================================
  public static calculateIPv4(ip: string, cidr: number): IPv4Result {
    if (cidr < 0 || cidr > 32)
      throw new Error("CIDR inválido para IPv4 (0-32).");

    const ipInt = this.ipv4ToInt(ip);
    const maskInt = cidr === 0 ? 0 : (~0 << (32 - cidr)) >>> 0;
    const wildcardInt = ~maskInt >>> 0;

    const networkInt = (ipInt & maskInt) >>> 0;
    const broadcastInt = (networkInt | wildcardInt) >>> 0;

    let minHostInt = networkInt + 1;
    let maxHostInt = broadcastInt - 1;
    let numHosts = cidr >= 31 ? 0 : Math.pow(2, 32 - cidr) - 2;

    if (cidr === 31) {
      minHostInt = networkInt;
      maxHostInt = broadcastInt;
      numHosts = 2;
    } else if (cidr === 32) {
      minHostInt = networkInt;
      maxHostInt = networkInt;
      numHosts = 1;
    }

    const firstOctet = (ipInt >>> 24) & 255;
    const secondOctet = (ipInt >>> 16) & 255;

    return {
      ip: ip,
      network: `${this.intToIPv4(networkInt)}/${cidr}`,
      netmask: this.intToIPv4(maskInt),
      wildcard: this.intToIPv4(wildcardInt),
      broadcast: this.intToIPv4(broadcastInt),
      minHost: this.intToIPv4(minHostInt),
      maxHost: this.intToIPv4(maxHostInt),
      numHosts: numHosts,
      networkClass: this.getIPv4Class(firstOctet),
      networkType: this.getIPv4Type(firstOctet, secondOctet),
      ipBinary: this.toBinaryFormated(ipInt),
      networkBinary: this.toBinaryFormated(networkInt),
      netmaskBinary: this.toBinaryFormated(maskInt),
      wildcardBinary: this.toBinaryFormated(wildcardInt),
      broadcastBinary: this.toBinaryFormated(broadcastInt),
    };
  }

  // NOVO: Gerador de Sub-redes (Limitado a 256 para não travar o navegador)
  public static generateIPv4Subnets(
    ip: string,
    baseCidr: number,
    targetCidr: number,
    limit: number = 256,
  ): SubnetSplit[] {
    if (targetCidr <= baseCidr || targetCidr > 32) return [];

    const baseResult = this.calculateIPv4(ip, baseCidr);
    const baseNetworkInt = this.ipv4ToInt(baseResult.network.split("/")[0]!);
    const step = targetCidr === 32 ? 1 : (1 << (32 - targetCidr)) >>> 0;
    const totalSubnets = Math.pow(2, targetCidr - baseCidr);
    const count = Math.min(totalSubnets, limit); // Proteção contra loops infinitos/travamentos

    const subnets: SubnetSplit[] = [];
    const numHosts =
      targetCidr >= 31
        ? targetCidr === 32
          ? 1
          : 2
        : Math.pow(2, 32 - targetCidr) - 2;

    for (let i = 0; i < count; i++) {
      const netInt = (baseNetworkInt + i * step) >>> 0;
      const bcastInt =
        targetCidr === 32 ? netInt : (netInt | (~0 >>> targetCidr)) >>> 0;

      let minInt = targetCidr >= 31 ? netInt : netInt + 1;
      let maxInt = targetCidr >= 31 ? bcastInt : bcastInt - 1;

      subnets.push({
        network: `${this.intToIPv4(netInt)}/${targetCidr}`,
        range: `${this.intToIPv4(minInt)} - ${this.intToIPv4(maxInt)}`,
        broadcast: this.intToIPv4(bcastInt),
        hosts: numHosts,
      });
    }
    return subnets;
  }

  private static getIPv4Class(firstOctet: number): string {
    if (firstOctet >= 1 && firstOctet <= 126) return "Classe A";
    if (firstOctet >= 128 && firstOctet <= 191) return "Classe B";
    if (firstOctet >= 192 && firstOctet <= 223) return "Classe C";
    if (firstOctet >= 224 && firstOctet <= 239) return "Classe D (Multicast)";
    if (firstOctet >= 240 && firstOctet <= 255)
      return "Classe E (Experimental)";
    return "Indefinida";
  }

  private static getIPv4Type(firstOctet: number, secondOctet: number): string {
    if (firstOctet === 10) return "Privado";
    if (firstOctet === 172 && secondOctet >= 16 && secondOctet <= 31)
      return "Privado";
    if (firstOctet === 192 && secondOctet === 168) return "Privado";
    if (firstOctet === 127) return "Loopback";
    if (firstOctet === 169 && secondOctet === 254) return "APIPA (Link-Local)";
    if (firstOctet >= 224) return "Reservado";
    return "Público";
  }

  private static ipv4ToInt(ip: string): number {
    return (
      ip
        .split(".")
        .reduce((int, octet) => (int << 8) + parseInt(octet, 10), 0) >>> 0
    );
  }

  private static intToIPv4(int: number): string {
    return [
      (int >>> 24) & 255,
      (int >>> 16) & 255,
      (int >>> 8) & 255,
      int & 255,
    ].join(".");
  }

  private static toBinaryFormated(int: number): string {
    return (
      (int >>> 0)
        .toString(2)
        .padStart(32, "0")
        .match(/.{1,8}/g)
        ?.join(".") || ""
    );
  }

  // ==========================================
  // CÁLCULOS IPv6
  // ==========================================
  public static calculateIPv6(ip: string, cidr: number): IPv6Result {
    if (cidr < 0 || cidr > 128)
      throw new Error("CIDR inválido para IPv6 (0-128).");

    const expanded = this.expandIPv6(ip);
    const ipBigInt = this.ipv6ToBigInt(expanded);
    const maskBigInt =
      cidr === 0 ? 0n : ((1n << 128n) - 1n) ^ ((1n << BigInt(128 - cidr)) - 1n);

    const networkBigInt = ipBigInt & maskBigInt;
    const lastAddressBigInt =
      networkBigInt | (~maskBigInt & ((1n << 128n) - 1n));
    const subnets64 = cidr <= 64 ? 1n << BigInt(64 - cidr) : 0n;

    return {
      ipExpanded: expanded,
      network: `${this.bigIntToIPv6(networkBigInt)}/${cidr}`,
      lastAddress: this.bigIntToIPv6(lastAddressBigInt),
      numSubnets64: subnets64,
      networkType: this.getIPv6Type(expanded),
    };
  }

  private static getIPv6Type(ipExpanded: string): string {
    if (ipExpanded === "0000:0000:0000:0000:0000:0000:0000:0001")
      return "Loopback";
    if (ipExpanded === "0000:0000:0000:0000:0000:0000:0000:0000")
      return "Unspecified";

    const firstBlock = ipExpanded.substring(0, 4).toLowerCase();

    if (firstBlock.startsWith("ff")) return "Multicast";
    if (
      firstBlock.startsWith("fe8") ||
      firstBlock.startsWith("fe9") ||
      firstBlock.startsWith("fea") ||
      firstBlock.startsWith("feb")
    )
      return "Link-Local";
    if (firstBlock.startsWith("fc") || firstBlock.startsWith("fd"))
      return "Unique Local";
    if (firstBlock.startsWith("2") || firstBlock.startsWith("3"))
      return "Global Unicast";

    return "Uso Específico / Reservado";
  }

  private static expandIPv6(ip: string): string {
    let full = ip;
    if (full.includes("::")) {
      const parts = full.split("::");
      const left = parts[0] ? parts[0].split(":") : [];
      const right = parts[1] ? parts[1].split(":") : [];
      const missing = 8 - (left.length + right.length);
      const zeros = Array(missing).fill("0000");
      full = [...left, ...zeros, ...right].join(":");
    }
    return full
      .split(":")
      .map((block) => block.padStart(4, "0"))
      .join(":");
  }

  private static ipv6ToBigInt(ipExpanded: string): bigint {
    return BigInt(`0x${ipExpanded.replace(/:/g, "")}`);
  }

  private static bigIntToIPv6(int: bigint): string {
    const hex = int.toString(16).padStart(32, "0");
    return hex.match(/.{1,4}/g)?.join(":") || "";
  }
}
