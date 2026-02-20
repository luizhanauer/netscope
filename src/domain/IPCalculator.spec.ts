import { describe, it, expect } from 'vitest';
import { IPCalculator } from './IPCalculator';

describe('IPCalculator Domain Logic', () => {
    
    describe('IPv4 Calculations', () => {
        it('should calculate correct network data for 192.168.0.1/24', () => {
            const result = IPCalculator.calculateIPv4('192.168.0.1', 24);
            
            expect(result.network).toBe('192.168.0.0/24');
            expect(result.broadcast).toBe('192.168.0.255');
            expect(result.netmask).toBe('255.255.255.0');
            expect(result.numHosts).toBe(254);
            expect(result.networkType).toBe('Privado');
        });

        it('should identify public IP addresses correctly', () => {
            const result = IPCalculator.calculateIPv4('8.8.8.8', 32);
            expect(result.networkType).toBe('Público');
        });

        it('should handle /31 networks (Point-to-Point)', () => {
            const result = IPCalculator.calculateIPv4('10.0.0.0', 31);
            expect(result.numHosts).toBe(2); // RFC 3021
        });

        it('should throw error for invalid CIDR', () => {
            expect(() => IPCalculator.calculateIPv4('10.0.0.1', 33)).toThrow();
        });
    });

    describe('IPv6 Calculations', () => {
        it('should expand compressed IPv6 addresses', () => {
            const result = IPCalculator.calculateIPv6('2001:db8::1', 64);
            expect(result.ipExpanded).toBe('2001:0db8:0000:0000:0000:0000:0000:0001');
        });

        it('should identify Global Unicast type', () => {
            const result = IPCalculator.calculateIPv6('2001:db8::', 32);
            expect(result.networkType).toBe('Global Unicast');
        });

        it('should identify Link-Local addresses', () => {
            const result = IPCalculator.calculateIPv6('fe80::1', 64);
            expect(result.networkType).toBe('Link-Local');
        });
    });

    describe('VLSM Engine (Subnet Splitting)', () => {
        it('should split a /24 network into two /25 networks', () => {
            const subnets = IPCalculator.generateIPv4Subnets('192.168.1.0', 24, 25);
            
            expect(subnets).toHaveLength(2);
            expect(subnets[0]!.network).toBe('192.168.1.0/25');
            expect(subnets[1]!.network).toBe('192.168.1.128/25');
        });

        it('should respect the limit of generated subnets to prevent memory overflow', () => {
            // Tentando dividir um /24 em /32 geraria 256 redes. 
            // Se tentássemos um /8 em /32, o limit de 256 deve agir.
            const limit = 10;
            const subnets = IPCalculator.generateIPv4Subnets('10.0.0.0', 8, 32, limit);
            expect(subnets.length).toBe(limit);
        });

        it('should calculate correct host count for subnets', () => {
            const subnets = IPCalculator.generateIPv4Subnets('172.16.0.0', 16, 24);
            expect(subnets[0]!.hosts).toBe(254);
        });
    });
});